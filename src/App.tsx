import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NewNote } from './pages/NewNote';
import { useLocalStorage } from './hooks/UseLocalStorage';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NoteList } from './pages/NoteList';
import { NoteLayout } from './components/NoteLayout';
import { Note } from './pages/Note';
import { EditNote } from './pages/EditNote';


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

function updateTag(id : string, label : string){
  //updating only the label of the tag with the given id
  setTags(prevTags => {
    return prevTags.map(tag => {
      if(tag.id === id){
        return {...tag, label} //updating only the label of the tag
      } else {
        return tag
      }
    })
  });
}

function deleteTag(id : string){
  setTags (prevTags => {
    return prevTags.filter(tag => tag.id !== id) //returning all tags except the one with the matching ID
  });
}

// Update note function that updates a note by its ID
function onUpdateNote(id: string, { tags, ...data }: NoteData) {
  setNotes(prevNotes => {
    return prevNotes.map(note => {
      // If the note ID matches, update its data and tag IDs
      if (note.id === id) {
        //tagIds : array of string IDs that we need to update
        return { ...note, ...data, tagIds: tags.map(tag => tag.id) } //...data is new data overwriting the ...note
      } else {
        return note
      }
    })
  });
}

function onDeleteNote(id: string) {
  setNotes(prevNotes => {
    return prevNotes.filter(note => note.id !== id) //returning all notes except the one with the matching ID
  });
}

  return (
    <Container className="my-4">
    <Routes>
      <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags} onupdateTag={updateTag} onDeleteTag={deleteTag} />}></Route>
      <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />}></Route>
      <Route path="/:id" element={<NoteLayout notes = {notesWithTags} />}>
        <Route index element={<Note onDeleteNote={onDeleteNote} />} />
        <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Container>
  )
}

export default App
