import { useCallback, useRef, useState } from "react";

/**
 * Перетаскивание по Pointer Events с возвратом "ровно в (0,0)" при отпускании.
 * Без preventDefault и без пассивных конфликтов.
 */
export default function useDragTranslate({
  snapBack = true,
  returnDuration = 0.35,
  springBezier = "cubic-bezier(0.22, 1.28, 0.36, 1)",
  onDragStart,
  onDragEnd,
} = {}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const baseRef = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setDragging(true);
      startRef.current = { x: e.clientX, y: e.clientY };
      baseRef.current = { ...offset };
      onDragStart?.(); // Вызываем колбэк начала перетаскивания
    },
    [offset, onDragStart]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      setOffset({ x: baseRef.current.x + dx, y: baseRef.current.y + dy });
    },
    [dragging]
  );

  const endDrag = useCallback(
    (e) => {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      setDragging(false);
      onDragEnd?.(); // Вызываем колбэк окончания перетаскивания
      if (snapBack) setOffset({ x: 0, y: 0 });
    },
    [snapBack, onDragEnd]
  );

  const translateStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: dragging
      ? "transform 0s"
      : `transform ${returnDuration}s ${springBezier}`,
    touchAction: "none",
    cursor: dragging ? "grabbing" : "grab",
    willChange: "transform",
  };

  return {
    dragging,
    translateStyle,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
