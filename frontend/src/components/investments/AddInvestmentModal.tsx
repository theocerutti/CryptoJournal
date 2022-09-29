import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, } from "@chakra-ui/react";
import React from "react";
import InvestmentForm from "./InvestmentForm";

const AddInvestmentModal = (props: any) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Add investment</ModalHeader>

        <ModalCloseButton/>

        <ModalBody>
          <InvestmentForm {...props} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddInvestmentModal;
