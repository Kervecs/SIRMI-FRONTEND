/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios';
import { Icon } from 'semantic-ui-react';




function UpdateModalComponent(data) {
    const [isShow, invokeModal] = useState(false);

    const initModal = () => {
        return invokeModal(!isShow);
    }

    // form updating data
    const [id] = useState(data.id);
    const [name, setName] = useState(data.name);
    const [email, setEmail] = useState(data.email);


    
    const onSubmit2 = async (e,_id) => {
        try {
            e.preventDefault();
            const data = new FormData();
            data.append('id', data.id);
            data.append('name', data.name);
            data.append('email', data.email);

            const saveData = ( id, name, email ) => {
                return { name: name, email: email, id: id };
            }

            const save = saveData(id, name, email);
            console.log(save);
            
            //
            const res = await axios.put(`http://localhost:3005/api/v1/users/${id}`, save).then(res => {
                console.log(res);
                initModal();
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Icon variant='success' onClick={initModal}>
            <i class="fas fa-pen"></i>
            </Icon>

            <Modal show={isShow}>
                <Modal.Header closeButton onClick={initModal}>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>

                <form onSubmit={onSubmit2}>
                    <Modal.Body>
                        <p>Are you sure you want to update this user?</p>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control  type='text'
                                    name='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control  type='email'
                                    name='email'
                                    placeholder='Enter email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant='danger' onClick={initModal}>
                            Close
                        </Button>
                        <Button type='submit' variant='dark'>
                            Update
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default UpdateModalComponent
