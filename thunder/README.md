# p2print

A p2p market for 3d manufacturing.

## Get Started

`yarn install`

`yarn start`

Visit `localhost:3000` in the browser

## Vision

A peer-to-peer free market platform connecting those with access to a 3d printer
(printers) to those who require 3d prints (clients). Peers download or access the
software in a browser. Clients create jobs by selecting a .stl file they would
like to have printed. Clients add a payment bounty to the job. Clients provide
additional requirements. Printers browse availible jobs. Printers claim a job
and print the provided .stl file meeting the client's requirements. Printers
package and ship the finished print to the client's address. The printer gets
awarded the bounty upon delivery.

## Implementation

Both printers and clients will run the same software. There are no user levels or
accounts. Each peer has an anonymous id and can create and accept jobs at will.

Using nodejs and lib-p2p a command line suite of tools can be created allowing
peers to:

create/view/accept jobs
deposit a BTC reward into a multi-signature address
chat with printers/clients who have created/accepted their job
download the .stl files attached to a job
view/update an active job
sign the multi-sig escrow to authorize payment

When the customer assigns a bounty, an additional 15% will be requested to pay the
miltisig transaction that creates the job. The 15% deposit will be refunded to the
customer once the customer agrees that job was completed.

Open jobs are viewable in the marketplace.

A printer can browse open jobs and view details of a job before accepting.

To accept a job, the printer must make a deposit of 15% the reward amount to
accept the job. The deposit will be refunded once the customer and the printer
agrees that the job was completed.

The printer fabricates and prepares the print for shipping or delivery to the
customer. The printer marks the job as completed once he has shipped the print.
Once received, the customer may decide if they are happy with the print. If they
are pleased, they will mark the job as completed.

When the job is accepted and in the active state, a p2p chat is opened between
the customer and the printer. The peers can communicate and resolve any concerns.
Once both parties have marked the job as completed, the job closes and each peer
receives their security deposit.

In the event that there is a disagreement. Either party can elect to elect to move
the job to mediation state. In the case of mediation, a third peer enters the
multisig. This is the mediator, who will engage in a p2p chat with each peer and
suggest a payment outcome.

When if both peers accept the payment outcome, the it is executed and the job is
made to the closed state.

If either peer rejects the mediator's suggestion, a final arbitrator will make
the final decision. Arbitration is designed to be a rare event. Most disputes
can be resolved in the chat as both peers have a personal stake in creating a
positive outcome.

Mediation will handle most other cases.

## Data Model

A print job consists of:
- Customer provided title/short name
- an .STL file or .ZIP containing many files
- Material (PLA/ABS/PETG..)
- Color(s)
- Bounty Amount
- Notes
- Country Code (US/EU/AU/CA...)
- Status (open/active/closed...)
- A chat log between printer and customer (only available once active)



## Concerns

Any marketplace will incur disputes between peers. Without a central authority to
mediate them, disputes must be handled by other peers with a personal stake in the
platform who maintain a reputation of successful dispute mediation. Such peers
must also be rewarded for their efforts and have their mediation privileges revoked algorithmically.

Hearing both sides of a dispute may require photographic evidence. For example,
a printer shows a photo of a flawless print before being shipped and the client
shows a photo of a broken print. Dispute resolution would ideally be doable without
photos since image files impose large storage capacity on the P2P network.
