import React, { FC } from 'react';
import SimpleCell from './SimpleCell';
import Header from './Header';
import { MdDone } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';

interface RegistrationNoticeProps {
  success: boolean;
  failed: boolean;
  onClose: () => void;
}

const RegistrationNotice: FC<RegistrationNoticeProps> = ({ success, failed, onClose }) => {
  return (
    <>
      {success && (
        <div>
          <SimpleCell
            before={<MdDone size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
          >
            <Header>Ваша заявка принята</Header>
            <p>Я свяжусь с вами в ближайшее время</p>
          </SimpleCell>
        </div>
      )}
      {failed && (
        <div>
          <SimpleCell
            before={<IoMdClose size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
          >
            <Header>Не удалось обработать заявку</Header>
            <p>Попробуйте еще раз или свяжитесь со мной любым способом</p>
          </SimpleCell>
        </div>
      )}
      <button onClick={() => onClose()} className=" inline bg-transparent border border-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition">
        Хорошо
      </button>
    </>
  );
};

export default RegistrationNotice;
