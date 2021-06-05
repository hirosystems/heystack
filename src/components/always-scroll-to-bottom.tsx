import React, { useEffect, useRef } from 'react';

export const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement | null>();
  useEffect(() => elementRef?.current?.scrollIntoView());
  return <div ref={elementRef as any} />;
};
