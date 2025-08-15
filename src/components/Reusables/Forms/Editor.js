import React, { useEffect, useState, useRef } from 'react'
const App = props => {
  const [content, setContent] = useState(props.input)
  const editorRef = useRef()
  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, ClassicEditor } = editorRef.current || {}
  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    }
    setEditorLoaded(true)
  }, [])
  return editorLoaded ? (
    <CKEditor
      editor={ClassicEditor}
      data={content}
      onReady={editor => {
        console.log('Editor is ready to use!', editor)
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        setContent(data)
        props.dataCallBack(data)
      }}
    />
  ) : (
    <div>Loading..</div>
  )
}

export default App
