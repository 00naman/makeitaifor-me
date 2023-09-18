import React, { useRef, useState } from "react";
import { FileData } from "@/utils/types";
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';

// if fileOrCollection is an Array, then collectionName is not null, null otherwise.
interface PreviewProps {
  fileOrCollection: FileData[] | FileData | null;
  collectionName?: string | null;
}

const Preview = (props: PreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileWidthInRem = 50; // Width of each file in rem units

  const setFileInView = (index: number) => {
    if (props.fileOrCollection === null) return;
    setCurrentIndex(index);

    const fileWidthInPixels =
      fileWidthInRem *
      parseFloat(getComputedStyle(document.documentElement).fontSize);
    const scrollPosition = index * fileWidthInPixels;
    scrollRef.current?.scrollTo({
      top: 0,
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  console.log("Preview", MM.getMathpixMarkdownStyles());

  if (props.fileOrCollection === null) {
    return (<></>);
  }

  let fileName;
  if (!Array.isArray(props.fileOrCollection))
    fileName = props.fileOrCollection.meta.Key.substring(37);
  else {
    fileName = props.collectionName;
  }
  return (
    <div className="relative">
      {/* <button
        className="absolute left-0 bottom-20 sm:hidden text-4xl z-10 text-orange-500 border-black px-5 p-2 border-2 rounded-full hover:bg-orange-500 hover:text-black"
        onClick={() => setFileInView(currentIndex - 1)}
      >
        Left
      </button>
      <button
        className="absolute right-0 bottom-20 sm:hidden text-4xl z-10 text-orange-500 border-black px-5 p-2 border-2 rounded-full hover:bg-orange-500 hover:text-black"
        onClick={() => setFileInView(currentIndex + 1)}
      >
        Right
      </button> */}
      {props.fileOrCollection !== null &&
        <div className="absolute h-10 text-3xl px-4 py-3 z-10">
          <span className="text-orange-500 underline decoration-white">
            {fileName && Array.isArray(props.fileOrCollection) && "Collection:"}
            {fileName && !Array.isArray(props.fileOrCollection) && "File:"}
          </span>
          {" " + fileName}
          {/* TODO: Add a breadcrumbs like extension to the end of the name, with a clickable browser default dropdown so the user can go to any single file in the list. On click the scrollbar scrolls to that file location.*/}
        </div>}
      <div className="flex-col snap-x snap-mandatory border-t-2 sm:border-2 relative bg-black flex overflow-x-auto overscroll-x-contain">
        <div ref={scrollRef} className="flex flex-row flex-nowrap w-full h-[100vh]">
          {Array.isArray(props.fileOrCollection) && props.fileOrCollection.map((file, index) => (
            <div className="snap-center" key={index}>
              <FilePreview key={index} file={file} active={false} />
            </div>
          ))}
          {!Array.isArray(props.fileOrCollection) &&
            <div className="snap-center">
              <FilePreview key={0} file={props.fileOrCollection} active={false} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Preview;

export const FilePreview = (props: FilePreviewProps) => (
  <>
    <div className="flex flex-row mt-10 mx-5 justify-between" style={{ minWidth: 'min(48rem, 80vw)', maxWidth: 'max(48rem, 80vw)' }}>
      <button className="text-white text-lg flex hover:border-orange-500 hover:border-2 border-2 border-black rounded-full items-center invisible">
        Text
      </button>
      {props.file !== undefined && <button className="text-white text-lg flex hover:text-orange-500 hover:border-2 border-2 border-black rounded-full items-center"> ✏️ Edit </button>}
    </div>
    <div className="border-2 sm:border-2 relative bg-black rounded-lg h-[90%] flex flex-col items-start text-left mx-5 overflow-y-auto overscroll-auto" style={{ minWidth: 'min(48rem, 80vw)', maxWidth: 'max(48rem, 80vw)' }}>
      <div className="flex justify-between flex-row w-full px-5">
        {props.file !== undefined && <h1 className="text-4xl text-left mt-5">File Name 1</h1>}
        <h1 className="text-4xl text-right mt-5 hidden">.</h1>
      </div>
      {props.file && props.file.parsedContent && <Page key={0} content={props.file.parsedContent} pgNum={1} />}
      {props.file === undefined && (
        <button className="h-full w-full flex justify-center items-center text-6xl sm:text-2xl max-w-full p-2 hover:text-orange-500 break-words">
          + Add a new file to this collection?
        </button>
      )}
    </div>
  </>
);

interface FilePreviewProps {
  file: FileData | undefined;
  active: boolean;
}

interface PageProps {
  content: string;
  pgNum: number;
}

export const Page = (props: PageProps) => {
  return (
    <div className="relative bg-white text-black rounded-lg h-full mx-5 my-1 flex flex-col" style={{ minWidth: 'min(45rem, 80vw)', maxWidth: 'min(45rem, 80vw)' }}>
      <div id='preview-content' dangerouslySetInnerHTML={{ __html: MM.markdownToHTML(props.content) }} />
      <div className="border-t border-black h-4 flex justify-between text-[10px] items-center px-2">
        <p className="text-left"></p>
        <p className="text-right">{"Page " + props.pgNum}</p>
      </div>
      <style jsx>{`
        hr {
            box-sizing: content-box;
            height: 0;
            overflow: visible;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 0;
            margin-bottom: 0.5em;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
        }
        p {
            margin-top: 0;
            margin-bottom: 1em;
        }
        ol, ul, dl {
            margin-top: 0;
            margin-bottom: 1em;
        }
        ol ol, ul ul, ol ul, ul ol {
            margin-bottom: 0;
        }
        dt {
            font-weight: 500;
        }
        dd {
            margin-bottom: 0.5em;
            margin-left: 0;
        }
        blockquote {
            margin: 0 0 1em;
        }
        dfn {
            font-style: italic;
        }
        b, strong {
            font-weight: bolder;
        }
        small {
            font-size: 80%;
        }
        sub, sup {
            position: relative;
            font-size: 75%;
            line-height: 0;
            vertical-align: baseline;
        }
        sub {
            bottom: -0.25em;
        }
        sup {
            top: -0.5em;
        }
        a {
            color: #0B93ff;
            text-decoration: none;
            background-color: transparent;
            outline: none;
            cursor: pointer;
            transition: color 0.3s;
        }
        a:hover {
            color: #33aaff;
        }
        a:active {
            color: #0070d9;
        }
        a:active, a:hover {
            text-decoration: none;
            outline: 0;
        }
        a[disabled] {
            color: #666;
            cursor: not-allowed;
            pointer-events: none;
        }
        pre, code, kbd, samp {
            font-size: 1em;
        }
        pre {
            margin-top: 0;
            margin-bottom: 1em;
            overflow: auto;
        }
        figure {
            margin: 0 0 1em;
        }
        img {
            vertical-align: middle;
            border-style: none;
        }
        svg:not(:root) {
            overflow: hidden;
        }
        table {
            border-collapse: collapse;
        }
        caption {
            padding-top: 0.75em;
            padding-bottom: 0.3em;
            color: rgba(0, 0, 0, 0.45);
            text-align: left;
            caption-side: bottom;
        }
        th {
            text-align: inherit;
        }
        mjx-container[jax="SVG"] {
            direction: ltr;
        }
        mjx-container[jax="SVG"] > svg {
            overflow: visible;
        }
        mjx-container[jax="SVG"] > svg a {
            fill: blue;
            stroke: blue;
        }
        mjx-assistive-mml {
            position: absolute !important;
            top: 0px;
            left: 0px;
            clip: rect(1px, 1px, 1px, 1px);
            padding: 1px 0px 0px 0px !important;
            border: 0px !important;
            display: block !important;
            width: auto !important;
            overflow: hidden !important;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        mjx-assistive-mml[display="block"] {
            width: 100% !important;
        }
        mjx-container[jax="SVG"][display="true"] {
            display: block;
            text-align: center;
            margin: 1em 0;
        }
        mjx-container[jax="SVG"][justify="left"] {
            text-align: left;
        }
        mjx-container[jax="SVG"][justify="right"] {
            text-align: right;
        }
        g[data-mml-node="merror"] > g {
            fill: red;
            stroke: red;
        }
        g[data-mml-node="merror"] > rect[data-background] {
            fill: yellow;
            stroke: none;
        }
        g[data-mml-node="mtable"] > line[data-line] {
            stroke-width: 70px;
            fill: none;
        }
        g[data-mml-node="mtable"] > rect[data-frame] {
            stroke-width: 70px;
            fill: none;
        }
        g[data-mml-node="mtable"] > .mjx-dashed {
            stroke-dasharray: 140;
        }
        g[data-mml-node="mtable"] > .mjx-dotted {
            stroke-linecap: round;
            stroke-dasharray: 0,140;
        }
        g[data-mml-node="mtable"] > svg {
            overflow: visible;
        }
        [jax="SVG"] mjx-tool {
            display: inline-block;
            position: relative;
            width: 0;
            height: 0;
        }
        [jax="SVG"] mjx-tool > mjx-tip {
            position: absolute;
            top: 0;
            left: 0;
        }
        mjx-tool > mjx-tip {
            display: inline-block;
            padding: .2em;
            border: 1px solid #888;
            font-size: 70%;
            background-color: #F8F8F8;
            color: black;
            box-shadow: 2px 2px 5px #AAAAAA;
        }
        g[data-mml-node="maction"][data-toggle] {
            cursor: pointer;
        }
        mjx-status {
            display: block;
            position: fixed;
            left: 1em;
            bottom: 1em;
            min-width: 25%;
            padding: .2em .4em;
            border: 1px solid #888;
            font-size: 90%;
            background-color: #F8F8F8;
            color: black;
        }
        foreignObject[data-mjx-xml] {
            font-family: initial;
            line-height: normal;
            overflow: visible;
        }
        .MathJax path {
            stroke-width: 3;
        }
        #setText > div {
            justify-content: inherit;
            margin-top: 0;
            margin-bottom: 1em;
        }
        #setText div:last-child {
            margin-bottom: 0 !important;
        }
        #setText > br, #preview-content br {
            line-height: 1.2;
        }
        #preview-content > div {
            margin-top: 0;
            margin-bottom: 1em;
        }
        .proof > div, .theorem > div {
            margin-top: 1rem;
        }
        #preview-content table {
            margin-bottom: 1em;
        }
        #setText table {
            margin-bottom: 1em;
        }
        mjx-container {
            text-indent: 0;
            overflow-y: visible !important;
            padding-top: 1px;
            padding-bottom: 1px;
        }
        .math-inline mjx-container {
            display: inline-block !important;
            page-break-inside: avoid;
        }
        .math-block {
            align-items: center;
            min-width: min-content;
            page-break-after: auto;
            page-break-inside: avoid;
            margin-top: 1em;
            margin-bottom: 1em;
        }
        .math-block[data-highlight-color] mjx-container[jax="SVG"] > svg {
            background-color: var(--mmd-highlight-color);
        }
        .math-block[data-highlight-text-color] mjx-container[jax="SVG"] > svg {
            color: var(--mmd-highlight-text-color);
        }
        .math-inline[data-highlight-color] mjx-container[jax="SVG"] {
            background-color: var(--mmd-highlight-color);
        }
        .math-inline[data-highlight-text-color] mjx-container[jax="SVG"] {
            color: var(--mmd-highlight-text-color);
        }
        .math-block p {
            flex-shrink: 1;
        }
        .math-block mjx-container {
            margin: 0 !important;
        }
        .math-error {
            background-color: yellow;
            color: red;
        }
        #preview-content svg, #setText svg {
            min-width: initial !important;
        }
        #preview-content img, #setText img {
            max-width: 100%;
        }
        #preview-content blockquote, #setText blockquote {
            page-break-inside: avoid;
            color: #666;
            margin: 0 0 1em 0;
            padding-left: 3em;
            border-left: .5em solid #eee;
        }
        #preview-content pre, #setText pre {
            border: none;
            padding: 0;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            border-radius: 6px;
            box-sizing: border-box;
            background: #f8f8fa;
        }
        #preview-content pre code, #setText pre code{
            padding: 1rem;
        }
        .empty {
            text-align: center;
            font-size: 18px;
            padding: 50px 0 !important;
        }
        #setText table, #preview-content table {
            display: table;
            overflow: auto;
            max-width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        #setText table th, #preview-content table th {
            text-align: center;
            font-weight: bold;
        }
        #setText table td, #preview-content table td, #setText table th, #preview-content table th {
            border: 1px solid #dfe2e5;
            padding: 6px 13px;
        }
        #setText table tr, #preview-content table tr {
            background-color: #fff;
            border-top: 1px solid #c6cbd1;
        }
        #setText table tr:nth-child(2n), #preview-content table tr:nth-child(2n) {
            background-color: #f6f8fa;
        }
        #setText .main-title, #setText .author, #preview-content .main-title, #preview-content .author {
            text-align: center;
            margin: 0 auto;
        }
        #preview-content .main-title, #setText .main-title {
            line-height: 1.2;
            margin-bottom: 1em;
        }
        #preview-content .author, #setText .author {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
        #preview-content .author p, #setText .author p {
            min-width: 30%;
            max-width: 50%;
            padding: 0 7px;
        }
        #preview-content .author > p > span, #setText .author > p > span {
            display: block;
            text-align: center;
        }
        #preview-content .section-title, #setText .section-title {
            margin-top: 1.5em;
        }
        #preview-content .abstract, #setText .abstract {
            text-align: justify;
            margin-bottom: 1em;
        }
        #preview-content .abstract p, #setText .abstract p {
            margin-bottom: 0;
        }
        @media print {
            #preview {
                font-size: 10pt!important;
          }
            svg {
                shape-rendering: crispEdges;
          }
            .math-block svg, math-inline svg {
                margin-top: 1px;
          }
            #preview-content img, #setText img {
                display: block;
          }
            #preview-content .figure_img img, #setText .figure_img img {
                display: inline;
          }
            .preview-right {
                word-break: break-word;
          }
            #preview-content h1, #setText h1 {
                page-break-inside: avoid;
                position: relative;
                border: 2px solid transparent;
          }
            #preview-content h1::after, #setText h1::after {
                content: "";
                display: block;
                height: 100px;
                margin-bottom: -100px;
                position: relative;
          }
            #preview-content h2, #setText h2 {
                page-break-inside: avoid;
                position: relative;
                border: 2px solid transparent;
          }
            #preview-content h2::after, #setText h2::after {
                content: "";
                display: block;
                height: 100px;
                margin-bottom: -100px;
                position: relative;
          }
            #preview-content h3, #setText h3 {
                page-break-inside: avoid;
                position: relative;
                border: 2px solid transparent;
          }
            #preview-content h3::after, #setText h3::after {
                content: "";
                display: block;
                height: 100px;
                margin-bottom: -100px;
                position: relative;
          }
            #preview-content h4, #setText h4 {
                page-break-inside: avoid;
                position: relative;
                border: 2px solid transparent;
          }
            #preview-content h4::after, #setText h4::after {
                content: "";
                display: block;
                height: 100px;
                margin-bottom: -100px;
                position: relative;
          }
            #preview-content h5, #setText h5 {
                page-break-inside: avoid;
                position: relative;
                border: 2px solid transparent;
          }
            #preview-content h5::after, #setText h5::after {
                content: "";
                display: block;
                height: 100px;
                margin-bottom: -100px;
                position: relative;
          }
            #preview-content h6, #setText h6 {
                page-break-inside: avoid;
                position: relative;
                border: 2px solid transparent;
          }
            #preview-content h6::after, #setText h6::after {
                content: "";
                display: block;
                height: 100px;
                margin-bottom: -100px;
                position: relative;
          }
        }
        #preview-content sup, #setText sup {
            top: -.5em;
            position: relative;
            font-size: 75%;
            line-height: 0;
            vertical-align: baseline;
        }
        #preview-content .text-url, #setText .text-url {
            color: #0B93ff;
            cursor: text;
            pointer-events: none;
        }
        #preview-content .text-url a:hover, #setText .text-url a:hover {
            color: #0B93ff;
        }
        mark {
            background-color: #feffe6;
        }
        span[data-underline-type] mark {
            background: inherit;
            background-color: #feffe6;
            padding-top: 0;
            padding-bottom: 0;
        }
        .table_tabular table th, .table_tabular table th {
            border: none !important;
            padding: 6px 13px;
        }
        #tabular tr, #tabular tr {
            border-top: none !important;
            border-bottom: none !important;
        }
        #tabular td, #tabular td {
            border-style: none !important;
            background-color: #fff;
            border-color: #000 !important;
            word-break: keep-all;
            padding: 0.1em 0.5em !important;
        }
        #tabular {
            display: inline-block !important;
        }
        #tabular td > p {
            margin-bottom: 0;
            margin-top: 0;
        }
        #tabular td._empty {
            height: 1.3em;
        }
        #tabular td .f {
            opacity: 0;
        }
        html[data-theme="dark"] #tabular tr, html[data-theme="dark"] #tabular td {
            background-color: #202226;
            border-color: #fff !important;
        }
        .table_tabular {
            overflow-x: auto;
            padding: 0 2px 0.5em 2px;
        }
        .figure_img {
            margin-bottom: 0.5em;
            overflow-x: auto;
        }
        ol.enumerate, ul.itemize {
            padding-inline-start: 40px;
        }
        /* It's commented because counter not supporting to change value ol.enumerate.lower-alpha {
            counter-reset: item ;
            list-style-type: none !important;
        }
        .enumerate.lower-alpha > li {
            position: relative;
        }
        .enumerate.lower-alpha > li:before {
            content: "("counter(item, lower-alpha)")";
            counter-increment: item;
            position: absolute;
            left: -47px;
            width: 47px;
            display: flex;
            justify-content: flex-end;
            padding-right: 7px;
            flex-wrap: nowrap;
            word-break: keep-all;
        }
        */
        .itemize > li {
            position: relative;
        }
        .itemize > li > span.li_level, .li_enumerate.not_number > span.li_level {
            position: absolute;
            right: 100%;
            white-space: nowrap;
            width: max-content;
          ;
            display: flex;
            justify-content: flex-end;
            padding-right: 10px;
            box-sizing: border-box;
        }
        .li_enumerate.not_number {
            position: relative;
            display: inline-block;
            list-style-type: none;
        }
      `}</style>
    </div>
  )
};
