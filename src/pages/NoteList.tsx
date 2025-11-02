import { useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router";
import ReactSelect from "react-select"
import type { Note, Tag } from "../App";
import { Card, Badge } from "react-bootstrap";
import styles from "../NoteList.module.css"

type SimplifiedNote = {
    id : string;
    title : string;
    tags : Tag[];
}

type NoteListProps = {
    availableTags : Tag[]
    notes : Note[]
    onDeleteTag: (id : string) => void;
    onupdateTag : (id : string, label : string) => void;
}

type EditTagsModalProps = {
    availableTags : Tag[];
    handleClose : () => void;
    show : boolean;
     onDeleteTag: (id : string) => void;
    onupdateTag : (id : string, label : string) => void;
}

export function NoteList({availableTags, notes, onDeleteTag, onupdateTag} : NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState<string>("")
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState<boolean>(false)

    // Memoized computation to filter notes based on title and selected tags
    const filteredNotes =  useMemo(() => {
        return notes.filter(note => {
          // Filtering logic based on title and selected tags 
            return (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) && // Checking if title matches 
            (selectedTags.length === 0 || selectedTags.every(tag => 
                note.tags.some(noteTag => noteTag.id === tag.id) // Checking if every selected tag is present in the note's tags
            ))
        })
    }, [title, selectedTags, notes])

  return (
     <>
  <Row className="align-items-center mb-4">
    <Col><h1>Notes  </h1></Col>
    <Col xs = 'auto' >
    <Stack gap={2} direction="horizontal">
        <Link to= "/new">
        <Button variant="primary">Create</Button>
        </Link>
        <Button variant="outline-secondary" onClick={() => setEditTagsModalIsOpen(true)}>Edit tags</Button>
      </Stack>
    </Col>
  </Row>
  <Form>
    <Row className="mb-4">
        <Col>
        <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter note title" value={title} onChange={e => setTitle(e.target.value)} />
        </Form.Group>
            </Col>
            <Col>
             <Form.Group controlId="tags">
          <Form.Label>Tags</Form.Label>
          {/* This is a CreatableReactSelect component that allows users to select and create tags */}
          <ReactSelect
            value={selectedTags.map(tag => {
              return { label: tag.label, value: tag.id }
            })}
            onChange={tags => {
              setSelectedTags(tags.map(tag => {
                return { label: tag.label, id: tag.value }
              }))
            }}
            isMulti
            options={availableTags.map(tag=>{
              return {label : tag.label, value : tag.id}
            })}
          />
          {/* Allows multiple tag selection and creation */}
        </Form.Group>
            </Col>
    </Row>
  </Form>

  <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {filteredNotes.map(note => (
              <Col key={note.id}>
                <NoteCard id={note.id} title={note.title} tags={note.tags} />
              </Col>
            ))}
  </Row>

  <EditTagsModal onDeleteTag={onDeleteTag} onupdateTag={onupdateTag} availableTags={availableTags} handleClose={() => setEditTagsModalIsOpen(false)} show={editTagsModalIsOpen} />
  </>
  )
 
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
      <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
        <Card.Body>
          <Stack gap={2} className="align-items-center justify-content-center h-100">
            <span className="fs-5">{title}</span>
            {/* Display tags as badges if there are any */}
            {tags.length > 0 && (
              <Stack gap={2} className="justify-content-center flex-wrap ">
                {tags.map(tag => (
                  <Badge className="text-truncate" key={tag.id}>
                    {tag.label}
                  </Badge>
                ))}
              </Stack>
            )}
          </Stack>
        </Card.Body>
      </Card>
  );
}

function EditTagsModal({availableTags, handleClose, show, onDeleteTag, onupdateTag}: EditTagsModalProps) {
  return <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Tags</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Stack gap={2}>
          {availableTags.map(tag => (
            <Row key={tag.id}>
              <Col>
                <Form.Control type="text" value={tag.label} onChange={e => {
                  onupdateTag(tag.id, e.target.value)
                }} />
              </Col>
              <Col xs ="auto">
                <Button variant="outline-danger" onClick={() => {onDeleteTag(tag.id)
                }}>&times;</Button>
              </Col>
            </Row>
          ))}
        </Stack>
      </Form>
    </Modal.Body>
  </Modal>;
}