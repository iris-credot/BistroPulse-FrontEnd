export interface FileInputProps {
  label: string;
  id: string;
  onFileChange: (file: File | null) => void;
}