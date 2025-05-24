
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notepad-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Add sample notes if none exist
      const sampleNotes: Note[] = [
        {
          id: '1',
          title: 'two',
          content: 'good interface and better experience',
          date: 'May 24'
        },
        {
          id: '2',
          title: 'one',
          content: 'test note pad',
          date: 'May 24'
        }
      ];
      setNotes(sampleNotes);
      localStorage.setItem('notepad-notes', JSON.stringify(sampleNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notepad-notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNote = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    if (editingNote) {
      setNotes(notes.map(note =>
        note.id === editingNote.id
          ? { ...note, title: newTitle, content: newContent, date: currentDate }
          : note
      ));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        date: currentDate
      };
      setNotes([newNote, ...notes]);
    }

    setNewTitle('');
    setNewContent('');
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setIsDialogOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const openNewNoteDialog = () => {
    setEditingNote(null);
    setNewTitle('');
    setNewContent('');
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-800">My Notes</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openNewNoteDialog}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-orange-50 border-orange-200">
              <DialogHeader>
                <DialogTitle className="text-orange-800">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-orange-700">Title</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter note title..."
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-orange-700">Content</Label>
                  <Textarea
                    id="content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write your note here..."
                    rows={6}
                    className="border-orange-200 focus:border-orange-400 resize-none"
                  />
                </div>
                <Button 
                  onClick={handleSaveNote}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!newTitle.trim() || !newContent.trim()}
                >
                  {editingNote ? 'Update Note' : 'Save Note'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-base border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm shadow-sm"
            />
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-orange-100 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-orange-800 line-clamp-1">
                  {note.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditNote(note)}
                    className="w-8 h-8 p-0 text-orange-600 hover:bg-orange-100"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteNote(note.id)}
                    className="w-8 h-8 p-0 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-orange-600 text-sm mb-3 line-clamp-3 leading-relaxed">
                {note.content}
              </p>
              <p className="text-orange-400 text-xs font-medium">
                {note.date}
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-orange-300 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-orange-700 mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-orange-500">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Click the + button to create your first note'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
