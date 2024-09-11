import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateIssueCommnetsAndImage, deleteComment, updateEdittedCommnetsAndImage } from '../ApiService/fetchIssueList';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const CommentsAndImage = ({ show, handleClose, issueData, onCommentDone }) => {
    const [showAddComment, setShowAddComment] = useState(false);
    const [comments, setComments] = useState('');
    const [file, setFile] = useState(null);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editImages, setEditImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    const fullName = localStorage.getItem('fullName');

    const handleAddComment = () => {
        setShowAddComment(true);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('comments', comments);
        formData.append('file', file);
        formData.append('fullName', fullName);
        formData.append('issueId', issueData.issueid);

        updateIssueCommnetsAndImage(formData).then(response => {
            if (response.status === 200) {
                setComments('');
                setFile(null);
                setShowAddComment(false);
                onCommentDone();
                alert("Comment Added Successfully!!");
                handleClose();
            } else {
                console.error('Failed to submit comment');
            }
        }).catch(error => {
            console.error('Error submitting comment:', error);
        });
    };

    const handleEdit = (comment) => {
        setComments(comment.comments);
        setFile(null);
        setEditCommentId(comment.comment_id);
        setEditingComment(comment);
        setEditImages(comment.commentsImageEntity || []);
    };

    const handleCancel = () => {
        setEditingComment(null);
        setComments('');
        setEditImages([]);
    };

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('comments', comments);
        formData.append('file', file);
        formData.append('fullName', fullName);
        formData.append('issueId', issueData.issueid);
        formData.append('commentId', editCommentId);

        updateIssueCommnetsAndImage(formData).then(response => {
            if (response.status === 200) {
                setComments('');
                setFile(null);
                setEditCommentId(null);
                setEditingComment(null);
                setEditImages([]);
                onCommentDone();
                alert("Comment Updated Successfully!!");
                handleClose();
            } else {
                console.error('Failed to update comment');
            }
        }).catch(error => {
            console.error('Error updating comment:', error);
        });
    };

    const handleEdittedUpdate = () => {
        const formData = new FormData();
        formData.append('comments', comments);
        formData.append('file', file);
        formData.append('fullName', fullName);
        formData.append('issueId', issueData.issueid);
        formData.append('commentId', editCommentId);
        editImages.forEach((image) => {
            formData.append('imageIds', image.img_id);
        });

        updateEdittedCommnetsAndImage(formData).then(response => {
            if (response.data === true) {
                setComments('');
                setFile(null);
                setEditCommentId(null);
                setEditingComment(null);
                setEditImages([]);
                onCommentDone();
                alert("Comment Updated Successfully!!");
                handleClose();
            } else {
                console.error('Failed to update comment');
            }
        }).catch(error => {
            console.error('Error updating comment:', error);
        });
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId).then(response => {
            if (response.status === 200) {
                onCommentDone();
                alert("Comment Deleted Successfully!!");
                handleClose();
            } else {
                console.error('Failed to delete comment');
            }
        }).catch(error => {
            console.error('Error deleting comment:', error);
        });
    };

    // const handleDeleteImage = (imgIndex) => {
    //     setEditImages(editImages.filter((_, index) => index !== imgIndex));
    // };

    const handleImageClick = (image) => {
        setPreviewImage(image);
    };

    const handleClosePreview = () => {
        setPreviewImage(null);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {issueData.commentsEntity && issueData.commentsEntity.length > 0 ? (
                        issueData.commentsEntity.map((comment, index) => (
                            <div key={index} style={{ marginBottom: '-5px' }} className={`comments-${comment.commented_by === fullName ? 'left' : 'right'}`}>
                                {editingComment && editingComment.comment_id === comment.comment_id ? (
                                    <>
                                        <Form.Group className="mb-3" controlId="comments">
                                            <Form.Label>Edit comment</Form.Label>
                                            <Form.Control as="textarea" rows={5} value={comments} onChange={(e) => setComments(e.target.value)} />
                                        </Form.Group>

                                        {editImages.map((image, imgIndex) => (
                                            <div key={imgIndex} style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                                                <img
                                                    src={image.image_name}
                                                    alt="Comment"
                                                    style={{ width: '60px', height: '60px', marginBottom: '10px', cursor: 'pointer' }}
                                                    onClick={() => handleImageClick(image.image_name)}
                                                />
                                                {/* <AiOutlineDelete
                                                    onClick={() => handleDeleteImage(imgIndex)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '0',
                                                        right: '0',
                                                        cursor: 'pointer',
                                                        background: '#fff',
                                                        borderRadius: '50%',
                                                    }}
                                                    size={18}
                                                    color="#dc3545"
                                                    title="Delete Image"
                                                /> */}
                                            </div>
                                        ))}

                                        <Form.Group className="mb-3" controlId="file">
                                            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                                        </Form.Group>
                                        <Button variant="primary" onClick={handleEdittedUpdate}>
                                            Update
                                        </Button>
                                        <Button variant="danger" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ marginTop: '1.2rem', marginBottom: '.6rem' }}><strong>{comment.commented_by} :</strong>

                                            {comment.commented_by === fullName && <div className='EditDeleteIcons'>
                                                <AiOutlineEdit
                                                    onClick={() => handleEdit(comment)}
                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                    size={23}
                                                    color="#007bff"
                                                    title="Edit"
                                                />
                                                <AiOutlineDelete
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete?')) {
                                                            handleDeleteComment(comment.comment_id);
                                                        }
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                    size={23}
                                                    color="#dc3545"
                                                    title="Delete"
                                                />
                                            </div>
                                            }

                                        </p>
                                        <div style={{ marginTop: '-15px' }}>
                                            <p>{comment.comments}</p>
                                            {comment.commentsImageEntity && comment.commentsImageEntity.length > 0 && (
                                                comment.commentsImageEntity.map((image, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={image.image_name}
                                                        alt="Comment"
                                                        style={{ width: '60px', height: '60px', marginBottom: '10px', cursor: 'pointer' }}
                                                        onClick={() => handleImageClick(image.image_name)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments available</p>
                    )}

                    {showAddComment && (
                        <>
                            <Form.Group className="mb-3" controlId="comments">
                                <Form.Label>Comments</Form.Label>
                                <Form.Control as="textarea" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="file">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {showAddComment ? (
                        <Button variant="primary" onClick={editCommentId ? handleUpdate : handleSubmit}>
                            {editCommentId ? 'Update' : 'Submit'}
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={handleAddComment}>
                            Add Comment
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Image Preview Modal */}
            {previewImage && (
                <Modal show={!!previewImage} onHide={handleClosePreview} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Image Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TransformWrapper>
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    {/* <div className="d-flex justify-content-between mb-3">
                                        <Button variant="outline-primary" onClick={zoomIn}>Zoom In</Button>
                                        <Button variant="outline-primary" onClick={zoomOut}>Zoom Out</Button>
                                        <Button variant="outline-primary" onClick={resetTransform}>Reset</Button>
                                    </div> */}
                                    <TransformComponent>
                                        <img src={previewImage} alt="Preview" style={{ width: '100%' }} />
                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePreview}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default CommentsAndImage;
