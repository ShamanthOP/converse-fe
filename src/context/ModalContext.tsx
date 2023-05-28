import React, { ReactNode, useState } from "react";

export interface ModalInterface {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const ModalContext = React.createContext<any>({});

interface ConversationModalInterface {
    children: ReactNode;
}

const ModalProvider = ({ children }: ConversationModalInterface) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const value: ModalInterface = {
        isModalOpen,
        openModal,
        closeModal,
    };
    return (
        <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    );
};

export default ModalProvider;
