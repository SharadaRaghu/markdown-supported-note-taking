import { Row, Col, Stack, Badge, Button } from "react-bootstrap";
import { useNote } from "../components/NoteLayout"
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

type NoteProps = {
  onDeleteNote : (id : string) => void;
} 

export function Note({onDeleteNote} : NoteProps) {

  const note = useNote();
  const navigate = useNavigate()
  return (
    <>
    {/* Displaying the note title and its associated tags */}
    <Row className="align-items-center mb-4">
      <Col>
        <h2>{note.title}</h2>
        {note.tags.length > 0 && (
          <Stack gap={1} direction="horizontal" className="flex-wrap ">
             {  note.tags.map(tag => (
                   <Badge className="text-truncate" key={tag.id}>
                     {tag.label}
                   </Badge>
                 ))     }
          </Stack>
        )}
      </Col>

      <Col xs="auto">
        <Stack direction="horizontal" gap={2}>
          <Link to={`/${note.id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button variant="outline-danger" 
          onClick={() => {
            onDeleteNote(note.id)
            navigate("/")
          }}
          >
            Delete</Button>
        <Link to="/">
            <Button variant="outline-secondary">Back</Button>
          </Link>
        </Stack>
      </Col>
    </Row>

    <ReactMarkdown>
      {note.markdown}
    </ReactMarkdown>
    </>
  )
}