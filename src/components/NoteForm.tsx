import { useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import type{ NoteData, Tag } from "../App";
import { v4 as uuidv4 } from 'uuid';


type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag : (tag : Tag) => void;
  availableTags : Tag[]
}

export function NoteForm( {onSubmit, onAddTag, availableTags}: NoteFormProps) {

//titleRef and markdownRef to access form values and submit the form
const titleRef = useRef<HTMLInputElement>(null); 
const markdownRef = useRef<HTMLTextAreaElement>(null);

const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
const navigate = useNavigate()


function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  console.log("Title:", titleRef.current?.value);
  console.log("Markdown:", markdownRef.current?.value);

  onSubmit({
    title: titleRef.current!.value,
    markdown: markdownRef.current!.value, // Non-null assertion operator because these will always be defined on submit and cannot be null
    tags: selectedTags // Placeholder for tags, to be implemented later
  });

  navigate("..")
}
    
    return (
    <>
   <Form onSubmit={handleSubmit}>
     <Stack gap={4}>
       <Row>
        <Col>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control required ref={titleRef} />
        </Form.Group>
      </Col>
        <Col>
        <Form.Group controlId="tags">
          <Form.Label>Tags</Form.Label>
          {/* This is a CreatableReactSelect component that allows users to select and create tags */}
          <CreatableReactSelect
          onCreateOption={label =>{
            const newTag = { id : uuidv4() , label }
            onAddTag(newTag)
            setSelectedTags(prev=>
              [...prev, newTag]
            )
          }}
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
         <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control required as="textarea" rows={15} ref={markdownRef} />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
          {/* .. means go back to previous route */}
          <Button type="button" variant="outline-secondary">
            Cancel
          </Button>
            </Link>
        </Stack>
     </Stack>
   </Form>
    </>
    );
}