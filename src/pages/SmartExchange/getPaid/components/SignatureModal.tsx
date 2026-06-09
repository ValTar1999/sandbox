import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import clsx from 'clsx';
import Button from '../../../../components/common/base/Button';
import Icon from '../../../../components/common/base/Icon';
import Input from '../../../../components/common/base/Input';
import LayoutModal from '../../../../components/common/modal/LayoutModal';
import WrapModal from '../../../../components/common/modal/WrapModal';
import {
  SIGNATURE_INVALID_CHARS_MESSAGE,
  SIGNATURE_NAME_PATTERN,
  type SignatureMode,
} from '../constants';

const SignatureModal = ({
  open,
  onClose,
  onCancel,
  onSign,
}: {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSign: () => void;
}) => {
  const [mode, setMode] = useState<SignatureMode>('draw');
  const [typedName, setTypedName] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [drawError, setDrawError] = useState(false);
  const [fullNameError, setFullNameError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const ensureCanvasReady = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const dpr = window.devicePixelRatio || 1;
    const bitmapWidth = Math.round(rect.width * dpr);
    const bitmapHeight = Math.round(rect.height * dpr);

    if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
      canvas.width = bitmapWidth;
      canvas.height = bitmapHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    return { canvas, ctx, rect };
  }, []);

  const getCanvasPoint = useCallback(
    (clientX: number, clientY: number, rect: DOMRect, canvas: HTMLCanvasElement) => ({
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    }),
    []
  );

  const clearCanvasDrawing = useCallback(() => {
    const ready = ensureCanvasReady();
    if (!ready) return;
    ready.ctx.clearRect(0, 0, ready.canvas.width, ready.canvas.height);
    lastPointRef.current = null;
  }, [ensureCanvasReady]);

  const resetModalState = useCallback(() => {
    setMode('draw');
    setTypedName('');
    setHasDrawn(false);
    setShowHint(false);
    setDrawError(false);
    setFullNameError(null);
    isDrawingRef.current = false;
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      resetModalState();
    }
  }, [open, resetModalState]);

  useEffect(() => {
    if (!open || mode !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const initCanvas = () => ensureCanvasReady();
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(initCanvas);
    });

    const observer = new ResizeObserver(initCanvas);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [open, mode, ensureCanvasReady]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const ready = ensureCanvasReady();
    if (!ready) return;

    const point = getCanvasPoint(
      event.clientX,
      event.clientY,
      ready.rect,
      ready.canvas
    );

    isDrawingRef.current = true;
    lastPointRef.current = point;
    setHasDrawn(true);
    setDrawError(false);
    setShowHint(false);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;

    const ready = ensureCanvasReady();
    if (!ready) return;

    const point = getCanvasPoint(
      event.clientX,
      event.clientY,
      ready.rect,
      ready.canvas
    );

    ready.ctx.beginPath();
    ready.ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ready.ctx.lineTo(point.x, point.y);
    ready.ctx.stroke();
    lastPointRef.current = point;
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClearCanvas = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    isDrawingRef.current = false;
    clearCanvasDrawing();
    setHasDrawn(false);
    setDrawError(false);
  };

  const handleModeChange = (nextMode: SignatureMode) => {
    setMode(nextMode);
    setShowHint(false);
    setDrawError(false);
    setFullNameError(null);
  };

  const handleTypedNameChange = (value: string) => {
    setTypedName(value);
    if (fullNameError) {
      setFullNameError(null);
    }
    if (showHint) {
      setShowHint(false);
    }
  };

  const handleSign = () => {
    if (mode === 'type') {
      const trimmed = typedName.trim();
      if (!trimmed) {
        setFullNameError('Full Name is required');
        setShowHint(true);
        return;
      }
      if (!SIGNATURE_NAME_PATTERN.test(trimmed)) {
        setFullNameError(SIGNATURE_INVALID_CHARS_MESSAGE);
        setShowHint(false);
        return;
      }
      onSign();
      return;
    }

    if (!hasDrawn) {
      setDrawError(true);
      setShowHint(true);
      return;
    }

    onSign();
  };

  const signaturePreviewText = typedName.trim();

  return (
    <LayoutModal open={open}>
      <WrapModal
        className="w-full max-w-128"
        onClose={onClose}
        header={
          <span className="text-lg font-medium text-gray-900">Signature</span>
        }
        classContent="px-6 py-5"
        footer={
          <div className="flex justify-end gap-4">
            <Button variant="secondary" size="lg" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleSign}>
              Sign
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              className={clsx(
                'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 transition cursor-pointer',
                mode === 'draw' && 'bg-gray-100'
              )}
              onClick={() => handleModeChange('draw')}
            >
              Draw
            </button>
            <button
              type="button"
              className={clsx(
                'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 transition cursor-pointer',
                mode === 'type' && 'bg-gray-100'
              )}
              onClick={() => handleModeChange('type')}
            >
              Type
            </button>
          </div>

          {mode === 'draw' ? (
            <div
              className={clsx(
                'relative overflow-hidden rounded-2xl border bg-gray-50 p-4',
                drawError ? 'border-red-500' : 'border-gray-200'
              )}
            >
              <Button
                variant="secondary"
                size="xs"
                className="absolute right-4 top-4 z-10"
                onClick={handleClearCanvas}
              >
                Clear
              </Button>
              <canvas
                ref={canvasRef}
                className="block h-48 w-full cursor-crosshair touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium leading-5 text-gray-700">
                  Your Full Name
                </label>
                <Input
                  placeholder="Type here"
                  value={typedName}
                  onChange={(e) => handleTypedNameChange(e.target.value)}
                  error={Boolean(fullNameError)}
                />
                {fullNameError && (
                  <p className="mt-1 text-sm text-red-600">{fullNameError}</p>
                )}
              </div>
              <div className="flex max-h-64 min-h-64 w-full flex-col items-center justify-center gap-4 self-stretch rounded-2xl border border-gray-200 bg-gray-50 p-4">
                {signaturePreviewText ? (
                  <span
                    className="text-center text-4xl text-gray-900"
                    style={{
                      fontFamily:
                        "'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive",
                    }}
                  >
                    {signaturePreviewText}
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {showHint && (
            <div className="flex items-start gap-3 rounded-md bg-red-50 px-4 py-3">
              <Icon
                icon="exclamation-circle"
                variant="solid"
                className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              />
              <p className="text-sm leading-5 text-red-700">
                Tap and hold to draw or type in your digital signature.
              </p>
            </div>
          )}
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default SignatureModal;
