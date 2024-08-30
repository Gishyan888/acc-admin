import { useEffect } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import PropTypes from 'prop-types';
import Button from './Button';
import Fail from '../Images/Fail.svg'
import Success from '../Images/Success.svg'
import Warning from '../Images/Warning.svg'

export default function Modal({ isVisible, onClose, button1Text, button2Text, button1OnClick, button2OnClick, button1Color, button2Color, image }) {
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
                height: "300px",
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
            <div className='flex flex-col gap-4 items-center justify-center w-full h-full font-medium text-xl'>
                {image === "success" && <img src={Success} alt="success" />}
                {image === "fail" && <img src={Fail} alt="fail" />}
                {image === "warning" && <img src={Warning} alt="warning" />}
                {image === "success" && <div className='flex flex-col gap-2'>
                    <p className='text-center'>Success!</p>
                    <p className='text-center text-base'>Your action was completed.</p>
                </div>}
                {image === "fail" && <div className='flex flex-col gap-2'>
                    <p className='text-center'>Oops!</p>
                    <p className='text-center text-base'>Your action was failed.</p>
                </div>}
                {image === "warning" && <p className='text-center text-base'>Do you want to delete?</p>}
                <div className='flex gap-3 mt-4'>
                    {button1Text && <Button text={button1Text} onClick={button1OnClick} color={button1Color} />}
                    {button2Text && <Button text={button2Text} onClick={button2OnClick} color={button2Color} />}
                </div>
            </div>
        </Rodal>
    );
}

Modal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    button1Text: PropTypes.string,
    button2Text: PropTypes.string,
    button1OnClick: PropTypes.func,
    button2OnClick: PropTypes.func,
    button1Color: PropTypes.string,
    button2Color: PropTypes.string,
    image: PropTypes.string
}