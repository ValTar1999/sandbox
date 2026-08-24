import Button from './Button';
import Icon from './Icon';

type QueryErrorProps = {
  message?: string;
  onRetry?: () => void;
};

const QueryError = ({ message, onRetry }: QueryErrorProps) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
    <Icon
      icon="exclamation-circle"
      variant="solid"
      className="h-8 w-8 text-red-500"
    />
    <p className="text-sm leading-5 text-gray-500">
      {message ?? 'Could not load the data.'}
    </p>
    {onRetry && (
      <Button variant="secondary" size="md" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);

export default QueryError;
