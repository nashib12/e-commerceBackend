import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const TOOLBAR_OPTONS = [
    [{ header: [1,2,3,4, false]}],
    ['bold', 'italic', 'underline'],
    [{list: 'ordered'}, {list: 'bullet'}],
];

const isEditorEmpty = (html) => !html || html === "<pr><br></p>";

const QuillEditor = ({ value, onChange, placeholderText }) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        let initialized = false;
        const container = containerRef.current;

        if(!containerRef) return;
        containerRef.innerHTML = '';

        const editorDev = document.createElement('div');
        container.appendChild(editorDev);

        const quill = new Quill(editorDev, {
            theme: 'snow',
            placeholder: placeholderText,
            modules: { toolbar: TOOLBAR_OPTONS},
        });

        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
            quill.setSelection(quill.getLength(), 0);
        }

        quill.on('text-change', (_delta, _old, source) => {
            if (source !== 'user') return;
            const html = quill.root.innerHTML;
            onChangeRef.current(isEditorEmpty(html) ? '' : html);
        });

        quillRef.current = quill;
        initialized = true;

        return () => {
            if (!initialized) return;
            quill.off('text-change');
            quillRef.current = null;
            container.innerHTML = '';
        }
    }, []);

    useEffect(() => {
        const quill = quillRef.current;
        if(!quill) return;

        const currentHTML = quill.root.innerHTML;
        const incomingEmpty = isEditorEmpty(value);
        const editorEmpty = isEditorEmpty(currentHTML);

        if (value === currentHTML) return;
        if (incomingEmpty && editorEmpty ) return;
        const selection = quill.getSelection();

        if (incomingEmpty) {
            quill.setText('');
        } else {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        if (selection) {
            const newLength = quill.getLength();
            quill.setSelection(Math.min(selection.index, newLength - 1), 0);
        }
    }, [value]);

  return (
    <div ref={containerRef} className='bg-white h-30 w-full'>
    </div>
  )
}

export default QuillEditor