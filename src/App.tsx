import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NewNote } from './pages/NewNote';
import { useLocalStorage } from './hooks/UseLocalStorage';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NoteList } from './pages/NoteList';


export type Note = {
  id: string;
} & NoteData


//The difference between RawNoteData and NoteData is that RawNoteData stores only the tag IDs, while NoteData stores the full Tag objects.
//if RawNoteData stores only tagID then we need title and markdown too? because when we create a new note we need to store title, markdown and tagIDs
export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[]; //storing only tag IDs here
}

//This is to ony update tag value if it needs to change and not the entire note
export type RawNote = {
 id : string;
} & RawNoteData

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
}

//only tag could be updated separately instead of entire note
export type Tag = {
  id: string;
  label: string;
}

function App() {

// Using the custom useLocalStorage hook to manage notes and tags state
const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []); //only to update tags using Tag Type


const notesWithTags = useMemo(() => {
  return notes.map(note => {
    return {
      ...note,
      tags: tags.filter(tag => note.tagIds.includes(tag.id))
    }
  })
}, [notes, tags]);

function onCreateNote({ tags, ...data }: NoteData) {
  setNotes(prevNotes => {
    return [...prevNotes, { ...data, id: uuidv4(), tagIds: tags.map(tag => tag.id) }]
  });
}

function addTag(tag : Tag){
  setTags (prev => [...prev, tag])
}

  return (
    <Container className="my-4">
    <Routes>
      <Route path="/" element={<NoteList availableTags={tags} />}></Route>
      <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />}></Route>
      <Route path="/:id" >
        <Route index element={<h1>Show</h1>} />
        <Route path="edit" element={<h1>Edit</h1>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Container>
  )
}

export default App
