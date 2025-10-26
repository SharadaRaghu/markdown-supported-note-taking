import { useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router";
import ReactSelect from "react-select"
import type { Tag } from "../App";

type NoteListProps = {
    availableTags : Tag[]
}

export function NoteList({availableTags} : NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState<string>("")

  return (
     <>
  <Row>
    <Col><h1>Notes  </h1></Col>
    <Col xs = 'auto' >
    <Stack gap={2} direction="horizontal">
        <Link to= "/new">
        <Button variant="primary">Create</Button>
        </Link>
        <Button variant="outline-secondary">Edit tags</Button>
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
  </>
  )
 
}
