import { SubmissionResultType } from '../types/problem';

type Props = {
  result: SubmissionResultType;
};

export default function SubmissionResult({ result }: Props) {
  return (
    <div className={`submission-result ${result.status}`}>
      <h3>Submission Result</h3>
      {result.status === 'success' ? (
        <>
          <div className="stats">
            <span>Tests Passed: {result.testsPassed}/{result.totalTests}</span>
            <span>Time: {result.executionTime}</span>
            <span>Memory: {result.memoryUsed}</span>
          </div>
          <pre className="output">{result.message}</pre>
        </>
      ) : (
        <div className="error">
          <pre>{result.message}</pre>
        </div>
      )}
    </div>
  );
}
