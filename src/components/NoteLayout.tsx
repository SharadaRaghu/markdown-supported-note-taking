import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";
import type { Note } from "../App";

type NoteLayoutProps = {
  notes: Note[];
}


export function NoteLayout({ notes }: NoteLayoutProps) {

    // Extracting the note ID from the URL parameters using useParams hook. 
    const {id} = useParams()

    const note = notes.find(n => n.id === id) // This is to find the note with the matching ID from the notes array.
    if (note == null) {
    return <Navigate to = "/" replace/> // If no matching note is found, navigate back to the home page.
    }   

  return (
    <Outlet context={note} />
  );
}

export function useNote(){
    return useOutletContext<Note>(); // Custom hook to access the note data from the outlet context.
}
