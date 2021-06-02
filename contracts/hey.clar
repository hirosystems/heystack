;; hey
;; HeyStack -- a smart contract app built for the Stacks blockchain
(define-constant contract-creator tx-sender)

;; Error codes
(define-constant ERR_INVALID_CONTENT 0)
(define-constant ERR_CANNOT_LIKE_NON_EXISTENT_CONTENT 1)

;; Data maps and vars
(define-data-var content-index int 0)

(define-read-only (get-content-index)
  (ok (var-get content-index)))

(define-map like-state
  { content-index: int }
  { likes: int }
)

(define-read-only (get-like-count (id int))
  ;; Checks map for like count of given id
  ;; defaults to 0 likes if no entry found
  (ok (default-to { likes: 0 } (map-get? like-state { content-index: id }))))

;; Private functions
(define-private (increment-content-index)
  (begin
    (var-set content-index (+ (var-get content-index) 1))
    (ok (var-get content-index))))

;; Public functions
(define-public (publish-content (content (string-utf8 140)))
  (begin
    (print { content: content, index: (increment-content-index) })
    (map-set like-state 
      { content-index: (var-get content-index) } 
      { likes: 0 }
    )
    (ok { content: content, index: (var-get content-index) })))

(define-public (like-content (id int))
  (begin
    ;; cannot like content that doesn't exist
    (asserts! (>= (var-get content-index) id) (err ERR_CANNOT_LIKE_NON_EXISTENT_CONTENT))
    (ok
      (map-set like-state
        { content-index: id } 
        { likes: (+ 1 (get likes (unwrap! (get-like-count id) (err 0)))) }
      )
    )))

;; (define-public (request-hey principal)
;;   (begin
;;     ;; send hey to requesting person
;;     (ok)
;;   )
;; )