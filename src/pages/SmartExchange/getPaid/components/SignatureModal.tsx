import { useCallback, useEffect, useRef, useState } from 'react';
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

  const resetModalState = useCallback(() => {
    setMode('draw');
    setTypedName('');
    setHasDrawn(false);
    setShowHint(false);
    setDrawError(false);
    setFullNameError(null);
    isDrawingRef.current = false;
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

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (!open || mode !== 'draw') return;
    setupCanvas();
  }, [open, mode, setupCanvas]);

  const getCanvasPoint = (
    clientX: number,
    clientY: number
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (clientX: number, clientY: number) => {
    const point = getCanvasPoint(clientX, clientY);
    const ctx = canvasRef.current?.getContext('2d');
    if (!point || !ctx) return;
    isDrawingRef.current = true;
    setHasDrawn(true);
    setDrawError(false);
    setShowHint(false);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const drawLine = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current) return;
    const point = getCanvasPoint(clientX, clientY);
    const ctx = canvasRef.current?.getContext('2d');
    if (!point || !ctx) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleClearCanvas = () => {
    setupCanvas();
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
                'relative flex max-h-64 min-h-64 w-full flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-gray-50 p-4',
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
              <div className="relative min-h-0 w-full flex-1">
                <canvas
                  ref={canvasRef}
                  className="block h-full w-full cursor-crosshair touch-none"
                  onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
                  onMouseMove={(e) => drawLine(e.clientX, e.clientY)}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    if (!touch) return;
                    e.preventDefault();
                    startDrawing(touch.clientX, touch.clientY);
                  }}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    if (!touch) return;
                    e.preventDefault();
                    drawLine(touch.clientX, touch.clientY);
                  }}
                  onTouchEnd={stopDrawing}
                />
              </div>
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
