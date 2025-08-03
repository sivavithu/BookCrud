import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Book {
  id: string;
  name: string;
  author: string;
}

const API_BASE = 'http://localhost:8080'; // Vite frontend with proxy to gateway

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({ name: '', author: '' });
  const { user, logout, getAccessToken, refreshAccessToken } = useAuth();
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null); // State for Excel file
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to reset file input

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAccessToken();
    let response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`, // Only Authorization header
      },
    });

    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const newToken = getAccessToken();
        response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } else {
        logout();
        return null;
      }
    }

    return response;
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/books');
      if (response?.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        setError('Failed to fetch books');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingBook ? `/api/books/${editingBook.id}` : `/api/books`;
      const method = editingBook ? 'PUT' : 'POST';
      
      const response = await apiCall(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (response?.ok) {
        toast.success(editingBook ? 'Edit was successful!' : 'Book added successfully!');
        setFormData({ name: '', author: '' });
        setEditingBook(null);
        fetchBooks();
      } else {
        setError('Failed to save book');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({ name: book.name, author: book.author });
  };

  const handleDelete = (id: string) => {
    setDeleteBookId(id);
  };

  const performDelete = async () => {
    if (!deleteBookId) return;
    try {
      const response = await apiCall(`/api/books/${deleteBookId}`, { method: 'DELETE' });
      if (response?.ok) {
        toast.success('Delete was successful!');
        fetchBooks();
      } else {
        setError('Failed to delete book');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setDeleteBookId(null);
    }
  };

  const cancelEdit = () => {
    setEditingBook(null);
    setFormData({ name: '', author: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadExcel = async () => {
    if (!file) {
      toast.error('Please select an Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getAccessToken();
      const response = await apiCall('/api/books/upload-excel', {
        method: 'POST',
        body: formData,
      });

      if (response?.ok) {
        const data = await response.text();
        toast.success('Excel uploaded and data imported successfully!');
        fetchBooks(); // Refresh book list after import
        setFile(null); // Reset file state
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
      } else {
        const errorText = await response?.text() || 'Unknown error';
        toast.error(`Failed to upload Excel: ${errorText}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Network error during upload');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-warm-gradient p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">📚 My Library</h1>
            <p className="text-muted-foreground">Welcome back, {user?.username}!</p>
          </div>
          <Button onClick={logout} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Book title"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </Button>
                  {editingBook && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
              </form>
              <div className="mt-4">
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  ref={fileInputRef} // Add ref here
                />
                <Button onClick={handleUploadExcel} className="mt-2 w-full">
                  Upload Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Books ({books.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-4">Loading books...</p>
              ) : books.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No books yet. Add your first book!
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.name}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(book)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(book.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!deleteBookId} onOpenChange={(open) => !open && setDeleteBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Home;