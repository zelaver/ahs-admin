import StockItem from "@/components/StockItem";
import images from "@/constants/images";
import { getSetting, setSetting } from "@/database/settings";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const GAP = 8;
const DEFAULT_ORDER = ["aqua", "isiUlang", "galonKosong", "gas12kg", "gasKosong"];

type Pos = { x: number; y: number; width: number; height: number };

const DraggableStockGrid = ({ stocks, products, fetchStocks }: any) => {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [containerWidth, setContainerWidth] = useState(0);
  // tinggi asli hasil ukur, per id
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const saved = await getSetting("stock_order");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length) setOrder(parsed);
        } catch {}
      }
    })();
  }, []);

  const persistOrder = useCallback((newOrder: string[]) => {
    setSetting("stock_order", JSON.stringify(newOrder));
  }, []);

  const itemsMap = useMemo(
    () => ({
      aqua: {
        span: 1,
        render: () => (
          <StockItem
            id={products[0]?.id}
            image={images.aqua}
            name="Aqua"
            prodPrice={products[0]?.price}
            prodSubPrice={products[0]?.subs_price}
            stock={stocks?.stock_aqua}
            stocks={stocks}
            fetchStocks={fetchStocks}
          />
        ),
      },
      isiUlang: {
        span: 1,
        render: () => (
          <StockItem
            id={products[1]?.id}
            image={images.isiUlang}
            name="Isi Ulang"
            prodPrice={products[1]?.price}
            prodSubPrice={products[1]?.subs_price}
            stock={stocks?.stock_isi_ulang}
            stocks={stocks}
            fetchStocks={fetchStocks}
          />
        ),
      },
      galonKosong: {
        span: 2,
        render: () => (
          <StockItem
            image={images.galonKosong}
            name="Galon Kosong"
            stock={stocks?.stock_galon_kosong}
            stocks={stocks}
            fetchStocks={fetchStocks}
          />
        ),
      },
      gas12kg: {
        span: 1,
        render: () => (
          <StockItem
            id={products[2]?.id}
            image={images.gas12Kg}
            name="Gas 12 kg"
            stock={stocks?.stock_gas_12kg}
            prodPrice={products[2]?.price}
            prodSubPrice={products[2]?.subs_price}
            stocks={stocks}
            fetchStocks={fetchStocks}
          />
        ),
      },
      gasKosong: {
        span: 1,
        render: () => (
          <StockItem
            image={images.gasKosong}
            name="Gas Kosong"
            stock={stocks?.stock_gas_kosong}
            stocks={stocks}
            fetchStocks={fetchStocks}
          />
        ),
      },
    }),
    [stocks, products, fetchStocks]
  );

  const SLOT_SPANS = [1, 1, 2, 1, 1];

  const allMeasured = order.every((id) => measuredHeights[id] != null);

  const handleMeasure = useCallback((id: string, height: number) => {
    setMeasuredHeights((prev) => {
      if (prev[id] === height) return prev;
      return { ...prev, [id]: height };
    });
  }, []);

  // hitung posisi x/y tiap card, height per item pakai hasil ukur masing-masing
  // supaya rapi sejajar per baris, height baris = max height dari item2 di baris itu
  const layout = useMemo(() => {
    if (!containerWidth) return {} as Record<string, Pos>;
    const halfWidth = (containerWidth - GAP) / 2;
    const positions: Record<string, Pos> = {};
    let y = 0;
    let col = 0;
    let rowHeight = 0;
    let pendingHalf: string | null = null;

    const flushRow = () => {
      if (pendingHalf) positions[pendingHalf].height = rowHeight;
      y += rowHeight + GAP;
      rowHeight = 0;
      col = 0;
      pendingHalf = null;
    };

    order.forEach((id, index) => {
      const def = (itemsMap as any)[id];
      if (!def) return;
      const span = SLOT_SPANS[index] ?? 1; // span dari POSISI, bukan dari item
      const h = 136;

      if (span === 2) {
        if (col !== 0) flushRow();
        positions[id] = { x: 0, y, width: containerWidth, height: h };
        y += h + GAP;
      } else {
        const posX = col === 0 ? 0 : halfWidth + GAP;
        positions[id] = { x: posX, y, width: halfWidth, height: h };
        rowHeight = Math.max(rowHeight, h);
        if (col === 0) {
          col = 1;
          pendingHalf = id;
        } else {
          flushRow();
        }
      }
    });
    if (col !== 0) flushRow();

    return positions;
  }, [order, containerWidth, itemsMap]);

  const totalHeight = useMemo(() => {
    const vals = Object.values(layout);
    return vals.length ? Math.max(...vals.map((p) => p.y + p.height)) : 0;
  }, [layout]);

  const handleDrop = useCallback(
    (draggedId: string, dropX: number, dropY: number) => {
      let closestId = draggedId;
      let closestDist = Infinity;
      Object.entries(layout).forEach(([id, pos]) => {
        if (id === draggedId) return;
        const dist = Math.hypot(pos.x + pos.width / 2 - dropX, pos.y + pos.height / 2 - dropY);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = id;
        }
      });
      if (closestId === draggedId) return;
      setOrder((prev) => {
        const next = [...prev];
        const fromIdx = next.indexOf(draggedId);
        const toIdx = next.indexOf(closestId);
        next.splice(fromIdx, 1);
        next.splice(toIdx, 0, draggedId);
        persistOrder(next);
        return next;
      });
    },
    [layout, persistOrder]
  );

  const onLayoutContainer = (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width);

  return (
    <View onLayout={onLayoutContainer} style={{ width: "100%" }}>
      {/* PASS 1: measuring pass — render invisible, natural height, buat ngukur doang */}
      {containerWidth > 0 && !allMeasured && (
        <View style={{ position: "absolute", opacity: 0, width: containerWidth }} pointerEvents="none">
          {order.map((id) => {
            const def = (itemsMap as any)[id];
            if (!def) return null;
            const w = def.span === 2 ? containerWidth : (containerWidth - GAP) / 2;
            return (
              <View key={id} style={{ width: w }} onLayout={(e) => handleMeasure(id, e.nativeEvent.layout.height)}>
                {def.render()}
              </View>
            );
          })}
        </View>
      )}

      {/* PASS 2: render asli, cuma muncul kalau semua tinggi udah ke-measure */}
      <View onLayout={onLayoutContainer} style={{ width: "100%", height: totalHeight }}>
        {containerWidth > 0 &&
          order.map((id) => {
            const def = (itemsMap as any)[id];
            const pos = layout[id];
            if (!def || !pos) return null;
            return (
              <DraggableCard key={id} id={id} pos={pos} onDrop={handleDrop}>
                {def.render()}
              </DraggableCard>
            );
          })}
      </View>
    </View>
  );
};

const DraggableCard = ({ id, pos, onDrop, children }: any) => {
  const translateX = useSharedValue(pos.x);
  const translateY = useSharedValue(pos.y);
  const isDragging = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useEffect(() => {
    if (!isDragging.value) {
      translateX.value = withSpring(pos.x);
      translateY.value = withSpring(pos.y);
    }
  }, [pos.x, pos.y]);

  const pan = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd((e) => {
      const dropX = startX.value + e.translationX + pos.width / 2;
      const dropY = startY.value + e.translationY + pos.height / 2;
      runOnJS(onDrop)(id, dropX, dropY);
      isDragging.value = false;
      translateX.value = withSpring(pos.x);
      translateY.value = withSpring(pos.y);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: pos.width,
    height: pos.height,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex: isDragging.value ? 10 : 1,
  }));

  const dragHandleElement = (
    <GestureDetector gesture={pan.hitSlop({ top: 16, bottom: 16, left: 16, right: 16 })}>
      <View style={{ padding: 10 }} />
    </GestureDetector>
  );

  return (
    <Animated.View style={animatedStyle}>
      {React.cloneElement(children, { dragHandle: dragHandleElement })}
    </Animated.View>
  );
};

export default DraggableStockGrid;
