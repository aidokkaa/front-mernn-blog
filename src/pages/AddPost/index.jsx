import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import {  selectIsAuth } from "../../redux/slices/auth";
import { useNavigate,Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector} from 'react-redux';

import  axios from '../../axios'
export const AddPost = () => {;
  const {id} = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth);
  const [isLoading,setLoading] = React.useState(false)
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [imageUrl,setimageUrl]=React.useState('')
  const [tags, setTags] = React.useState('');
  const inputFileRef = React.useRef(null)

    const isEditing = Boolean(id)
  const handleChangeFile = async (event) => {
  try{
    const formData= new FormData();
    formData.append('image',event.target.files[0]);
    const {data} = await axios.post('/upload',formData);
    setimageUrl(data.url)
    console.log(data);
  }
  catch(err){
   console.warn(err);
   alert('Ошибка при загрузке фаила')
  }
  };
 

  const onClickRemoveImage = ()=>{
    setimageUrl('')
  }
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async()=>{
  try{
    setLoading(true);

    const fields = {
      title,imageUrl,
      tags: tags,
      text
    }

   

    const {data} = await axios.post('/posts',fields);

    const id = data._id

    navigate(`/posts/${id}`)
  }catch(err){
    console.log(err)
    alert('Ошибка при созданиий статьи')
  }

  }
   
 
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if(!window.localStorage.getItem('token') &&!isAuth){
    return <Navigate to = '/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick = {()=>inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить картинку
      </Button>
      <input  ref={inputFileRef} 
      type="file" 
      onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
        <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" /></>
      )}
     
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        fullWidth
      />
      <TextField
      value={tags} 
      classes={{ root: styles.tags }}
      onChange={(e)=>setTags(e.target.value)}
       variant="standard" placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};