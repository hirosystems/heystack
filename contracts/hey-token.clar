;; Implement the `ft-trait` trait defined in the `ft-trait` contract
;; https://github.com/hstove/stacks-fungible-token
(impl-trait 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA.ft-trait.sip-010-trait)

(define-constant contract-creator tx-sender)

(define-fungible-token hey-token)

(ft-mint? hey-token u10000 contract-creator)

;; get the token balance of owner
(define-read-only (get-balance (owner principal))
  (begin
    (ok (ft-get-balance hey-token owner))))

;; returns the total number of tokens
(define-read-only (get-total-supply)
  (ok (ft-get-supply hey-token)))

;; returns the token name
(define-read-only (get-name)
  (ok "Heystack Token"))

;; the symbol or "ticker" for this token
(define-read-only (get-symbol)
  (ok "HEY"))

;; the number of decimals used
(define-read-only (get-decimals)
  (ok u0))

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (if (is-eq tx-sender sender)
    (begin
      (try! (ft-transfer? hey-token amount sender recipient))
      (print memo)
      (ok true)
    )
    (err u4)))

(define-public (get-token-uri)
  (ok (some u"https://heystack.xyz/token-metadata.json")))
