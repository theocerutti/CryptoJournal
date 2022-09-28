import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

const AddInvestmentModal = (props: any) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>earaeraeraera</ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={props.onClose}>
            Close
          </Button>
          <Button colorScheme='blue' mr={3} onClick={props.onAdd}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddInvestmentModal;
