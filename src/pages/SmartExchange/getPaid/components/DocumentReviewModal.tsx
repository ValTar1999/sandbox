import { useState } from 'react';
import Button from '../../../../components/common/base/Button';
import Icon from '../../../../components/common/base/Icon';
import LayoutModal from '../../../../components/common/modal/LayoutModal';
import Modal from '../../../../components/common/modal/Modal';

const DocumentReviewModal = ({
  open,
  title,
  customerName,
  onClose,
  onAccept,
  onDispute,
}: {
  open: boolean;
  title: string;
  customerName: string;
  onClose: () => void;
  onAccept: () => void;
  onDispute: () => void;
}) => {
  const [disputeConfirmOpen, setDisputeConfirmOpen] = useState(false);

  const handleCloseAll = () => {
    setDisputeConfirmOpen(false);
    onClose();
  };

  const handleDisputeConfirm = () => {
    setDisputeConfirmOpen(false);
    onDispute();
  };

  return (
    <LayoutModal open={open}>
      <div className="m-auto flex h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-medium text-gray-900">{title}</h2>
          <Button
            icon="x"
            size="lg"
            variant="linkSecondary"
            onClick={handleCloseAll}
            aria-label="Close document review"
          />
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="mx-auto w-full max-w-[560px] rounded border border-gray-200 bg-white p-16 text-gray-700 shadow-sm">
            <h3 className="text-3xl font-semibold text-gray-900">
              Document Title
            </h3>
            <p className="mt-2 text-lg text-gray-500">
              Lorem Ipsum Nice Subtitle
            </p>
            <div className="mt-8 space-y-6 text-lg leading-8">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                venenatis mauris quis arcu vehicula, ac lobortis orci hendrerit.
                Phasellus lectus sem, auctor in lacinia eu, condimentum ac nisl.
              </p>
              <p>
                Vestibulum ut elementum ex, sed fermentum justo. Cras viverra
                libero ut felis rutrum, ac hendrerit sapien varius. Aenean
                venenatis gravida nulla et convallis.
              </p>
              <p>
                Praesent a scelerisque nunc, at auctor elit. Quisque sed tortor
                ipsum. Quisque at nisi scelerisque lectus sollicitudin placerat
                vitae efficitur lacus.
              </p>
            </div>
            <div className="mt-8 text-right text-sm font-medium text-gray-400">
              PAGE 1
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 border-t border-gray-200 px-6 py-4">
          <Button
            variant="secondary"
            size="lg"
            icon="x"
            iconClass="text-red-500"
            iconDirection="left"
            onClick={() => setDisputeConfirmOpen(true)}
          >
            Dispute
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon="check"
            iconDirection="left"
            iconClass="text-green-500"
            onClick={onAccept}
          >
            Accept
          </Button>
        </div>
      </div>
      <LayoutModal open={disputeConfirmOpen}>
        <Modal
          className="w-128"
          titleCenter={true}
          title="Dispute Documents"
          description={`Are you sure you want to dispute the documents?<br/><br/>The payment request will be cancelled and you'll need to contact [${customerName}] to receive the payment.`}
          icon={
            <Icon
              icon="exclamation"
              className="-mb-2 -mt-4 h-11 w-11 text-red-500"
            />
          }
          onClose={() => setDisputeConfirmOpen(false)}
          footer={
            <div className="grid grid-cols-2 items-center gap-6">
              <Button
                variant="secondary"
                size="xl"
                className="w-full"
                onClick={() => setDisputeConfirmOpen(false)}
              >
                Go Back
              </Button>
              <Button
                variant="primaryDistructive"
                size="xl"
                className="w-full"
                onClick={handleDisputeConfirm}
              >
                Dispute
              </Button>
            </div>
          }
        />
      </LayoutModal>
    </LayoutModal>
  );
};

export default DocumentReviewModal;
