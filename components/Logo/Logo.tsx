import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

export const Logo = () => {
  return (
    <div className='py-4 text-3xl text-center font-heading'>
      BlogGenerator
      <FontAwesomeIcon icon={faBrain} className='text-2xl text-slate-400' />
    </div>
  );
};
