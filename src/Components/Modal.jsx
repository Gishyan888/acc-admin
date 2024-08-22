import { useEffect } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import PropTypes from 'prop-types';
import Button from './Button';

export default function Modal({ value, isVisible, onClose, button1Text, button2Text, button1OnClick, button2OnClick, button1Color, button2Color }) {
    useEffect(() => {
        if (isVisible && !button1Text && !button2Text) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, button1Text, button2Text]);

    return (
        <Rodal
            customStyles={{
                width: "300px",
                height: "200px",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                marginTop: "150px",
            }}
            closeOnEsc={true}
            closeMaskOnClick={true}
            showCloseButton={true}
            visible={isVisible}
            onClose={onClose}
        >
            <div className='flex flex-col items-center justify-center w-full h-full font-medium text-xl p-4'>
                <p className='text-center'>{value}</p>
                <div className='flex gap-3 mt-4'>
                    {button1Text && <Button text={button1Text} onClick={button1OnClick} color={button1Color} />}
                    {button2Text && <Button text={button2Text} onClick={button2OnClick} color={button2Color} />}                </div>
            </div>
        </Rodal>
    );
}

Modal.propTypes = {
    value: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    button1Text: PropTypes.string,
    button2Text: PropTypes.string,
    button1OnClick: PropTypes.func,
    button2OnClick: PropTypes.func,
    button1Color: PropTypes.string,
    button2Color: PropTypes.string
}