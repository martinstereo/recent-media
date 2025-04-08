import './spinner.styles.scss';

interface SpinnerProps {
  type: 'letterboxd' | 'lastfm' | 'hardcover';
}

const Spinner = ({ type }: SpinnerProps) => {
  return (
    <div className={`spinner ${type}`}>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
    </div>
  );
};

export default Spinner;
