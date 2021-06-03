;; hey
;; HeyStack -- a smart contract app built for the Stacks blockchain

(define-constant contract-creator tx-sender)

(define-constant ERR_INVALID_CONTENT u0)
(define-constant ERR_CANNOT_LIKE_NON_EXISTENT_CONTENT u1)

(define-constant HEY_TREASURY 'ST18QBQ9HBSGZ76SKYVN970Q4MVZHJDAX1S7QSP62)

;;
;; Data maps and vars
(define-data-var content-index uint u0)

(define-read-only (get-content-index)
  (ok (var-get content-index))
)

(define-map like-state
  { content-index: uint }
  { likes: uint }
)

(define-map publisher-state
  { content-index: uint }
  { publisher: principal }
)

(define-read-only (get-like-count (id uint))
  ;; Checks map for like count of given id
  ;; defaults to 0 likes if no entry found
  (ok (default-to { likes: u0 } (map-get? like-state { content-index: id })))
)


(define-read-only (get-message-publisher (id uint))
  ;; Checks map for like count of given id
  ;; defaults to 0 likes if no entry found
  (ok (unwrap-panic (get publisher (map-get? publisher-state { content-index: id }))))
)

;;
;; Private functions
(define-private (increment-content-index)
  (begin
    (var-set content-index (+ (var-get content-index) u1))
    (ok (var-get content-index))
  )
)


(define-private (get-balance (recipient principal))
  (ok
    (unwrap-panic (contract-call? 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA.hey-token get-balance recipient))
  )
)

;;
;; Public functions
(define-public (send-message (content (string-utf8 140)))
  (let ((id (unwrap! (increment-content-index) (err u0))))
    (print { content: content, publisher: tx-sender, index: id })
    (map-set like-state 
      { content-index: id } 
      { likes: u0 }
    )
    (map-set publisher-state 
      { content-index: id } 
      { publisher: tx-sender }
    )
    (transfer-hey u1 HEY_TREASURY)
  )
)

(define-public (like-message (id uint))
  (begin
    ;; cannot like content that doesn't exist
    (asserts! (>= (var-get content-index) id) (err ERR_CANNOT_LIKE_NON_EXISTENT_CONTENT))
    ;; transfer 1 HEY to the principal that created the content
    (map-set like-state
      { content-index: id } 
      { likes: (+ u1 (get likes (unwrap! (get-like-count id) (err u0)))) }
    )
    (transfer-hey u1 (unwrap-panic (get-message-publisher id)))
  )
)

;;
;; Token contract interactions
(define-public (request-hey (recipient principal))
  (begin
    ;; add necessary guards
    ;; send hey to requesting person
    (ok
      (as-contract (contract-call? 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA.hey-token gift-tokens recipient))
    )
  )
)

(define-public (transfer-hey (amount uint) (recipient principal))
  (contract-call? 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA.hey-token transfer amount tx-sender recipient none)
)
