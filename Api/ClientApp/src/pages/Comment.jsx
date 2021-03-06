import React, { useState } from 'react'
import moment from 'moment'
import { authHeader } from '../auth'

import { getUserId } from '../auth'

export function Comment(props) {
  const [editedComment, setEditedComment] = useState(props.comment)

  const [editingComment, setEditingComment] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  const [reportingComment, setReportingComment] = useState(false)
  const [commentReport, setCommentReport] = useState({
    userId: 0,
    reporterId: 0,
    body: '',
  })

  function handleTextChange(event) {
    setEditedComment({
      ...editedComment,
      body: event.target.value,
    })
  }
  function submitComment(event) {
    event.preventDefault()

    fetch(`/api/Comments/${parseInt(props.comment.id)}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', ...authHeader() },
      body: JSON.stringify(editedComment),
    })
      .then(response => {
        // return response.json()
        if (response.status === 401) {
          return { status: 401, errors: { login: 'Not Authorized' } }
        } else if (response.status === 404) {
          // This one is for user doesn't match logged in user
          return { status: 404, errors: { login: 'Not Authorized' } }
        } else {
          return response.json()
        }
      })
      .then(apiData => {
        if (apiData.errors) {
          const newMessage = Object.values(apiData.errors).join(' ')
          setErrorMessage(newMessage)
        } else {
          setEditingComment(false)
          props.getCombo()
          setErrorMessage(undefined)
        }
      })
  }

  function handleSubmitCommentReport(event) {
    event.preventDefault()
    console.log('Comment Report:')
    console.log(commentReport)
  }

  return (
    <div className="comment">
      <div>
        <div className="vote">
          <button
            className="button-blank"
            onClick={event => {
              props.handleVote(
                event,
                'CommentVotes',
                props.comment.id,
                'upvote'
              )
            }}
          >
            <svg
              aria-hidden="true"
              className="m0 svg-icon iconArrowUpLg"
              width="36"
              height="36"
              viewBox="0 0 36 36"
            >
              <path d="M2 26h32L18 10 2 26z"></path>
            </svg>
          </button>
          <h3 className="black-text">{props.comment.netVote}</h3>
          <button
            className="button-blank"
            onClick={event => {
              props.handleVote(
                event,
                'CommentVotes',
                props.comment.id,
                'downvote'
              )
            }}
          >
            <svg
              aria-hidden="true"
              className="m0 svg-icon iconArrowDownLg"
              width="36"
              height="36"
              viewBox="0 0 36 36"
            >
              <path d="M2 10h32L18 26 2 10z"></path>
            </svg>
          </button>
        </div>

        <div className="body">
          <h5>
            Posted by {props.comment.user.displayName}{' '}
            {moment(props.comment.datePosted).fromNow()}
            <button
              className="edit"
              onClick={() => {
                setReportingComment(true)
              }}
            >
              report
            </button>
            {props.loggedInUser === props.comment.userId && (
              <>
                <button
                  className="edit"
                  onClick={() => {
                    setEditingComment(true)
                  }}
                >
                  edit
                </button>
              </>
            )}
          </h5>
          {editingComment && (
            <form className="edit-comment" onSubmit={submitComment}>
              <textarea
                value={editedComment.body}
                onChange={handleTextChange}
              />
              <button className="bg-yellow button black-text" type="submit">
                Submit
              </button>
              {errorMessage && (
                <div className="error-message">
                  <i class="fas fa-exclamation-triangle"></i> {errorMessage}
                </div>
              )}
            </form>
          )}
          {editingComment || <p>{props.comment.body}</p>}
        </div>
      </div>
      <form
        className="report"
        style={reportingComment ? { display: 'flex' } : { display: 'none' }}
        onSubmit={handleSubmitCommentReport}
      >
        <i
          className="fas fa-times"
          onClick={() => {
            setReportingComment(false)
          }}
        ></i>
        <h4>Report this comment</h4>
        <textarea
          placeholder="reason..."
          value={commentReport.body}
          onChange={event => {
            setCommentReport({ ...commentReport, body: event.target.value })
          }}
        />
        <button className="button">Submit</button>
      </form>
    </div>
  )
}
