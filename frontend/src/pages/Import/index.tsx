import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    const file = uploadedFiles[0].file
    data.set('file', file)

    try {
      await api.post('/transactions/import', data);
      await Swal.fire('Yeaaah...', 'Importação realizada com sucesso!', 'success');
      history.goBack();
    } catch (err) {
      if (err.response.status >= 500) {
        Swal.fire('Oops...', 'Tenha certeza que o CSV está no formato correto!', 'error');
      } else{
        Swal.fire('Oops...', err.response.data.message, 'error');
      }
      setUploadedFiles([]);
    }
  }

  function submitFile(files: File[]): void {
    const filesProp = files.flatMap<FileProps>(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));
    setUploadedFiles(filesProp);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
