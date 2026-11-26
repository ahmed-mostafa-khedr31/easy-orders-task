import { useState, type FormEvent } from "react";
import { useUiStore } from "../store/uiStore";
import { ChevronIcon } from "./Icons";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "My account", href: "#top" },
      { label: "Login", href: "#top" },
      { label: "Wishlist", href: "#buy-box" },
      { label: "Cart", href: "#buy-box" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Shipping Policy", href: "#product-description" },
      { label: "Returns & Refunds", href: "#product-description" },
      { label: "Cookies Policy", href: "#product-description" },
      { label: "Frequently asked", href: "#product-description" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#top" },
      { label: "Privacy Policy", href: "#top" },
      { label: "Terms & Conditions", href: "#product-description" },
      { label: "Contact Us", href: "#top" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const showToast = useUiStore((state) => state.showToast);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Enter a valid email address");
      return;
    }
    setEmail("");
    setOpen(false);
    showToast("You're on the list");
  }

  return (
    <footer className="mt-16 bg-footer text-ink">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.5fr_1fr_1fr_1fr] lg:px-0">
        <div className="w-full flex flex-col items-start justify-start">
          <img src="/logo.png" alt="John Lewis" className="h-8 max-w-44" />
          <form
            onSubmit={submit}
            className="mt-8 flex justify-between items-center gap-3   border-b border-[#000]  "
          >
            {open ? (
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Get latest offers to your inbox"
                aria-label="Email address"
                className="h-10 flex-1   border-0    px-0 text-sm outline-none focus:border-neutral-600"
              />
            ) : (
              <p className="text-sm text-[#787A7C]">
                Get latest offers to your inbox
              </p>
            )}
            <button
              type={open ? "submit" : "button"}
              aria-label={open ? "Subscribe" : "Open newsletter signup"}
              onClick={() => {
                if (!open) setOpen(true);
              }}
              className="grid ms-3 h-7 w-11 shrink-0 place-items-center rounded-lg bg-black text-white"
            >
              <ChevronIcon direction="right" size={14} />
            </button>
          </form>
          <div className="mt-6 flex gap-2 text-neutral-700">
            <Social label="Facebook" />

            <Social label="Instagram" />
            <Social label="Twitter" />
            <Social label="email" />
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold">{column.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center lg:justify-between justify-center gap-3 dashed-top-border px-4 py-6 text-xs text-neutral-500 lg:px-0">
        <p className="text-sm   text-[#3E3E59]">© John Lewis plc 2012 - 2024</p>
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1.5">
            <img src="/flags.png" alt="English" className="w-4.5 h-3.5" />
            <span className="text-sm font-semibold text-black">English</span>
            <ChevronIcon direction="down" size={14} />
          </button>
          <button className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-black">EGP</span>
            <ChevronIcon direction="down" size={14} />
          </button>{" "}
        </div>
      </div>
    </footer>
  );
}

function Social({ label }: { label: string }) {
  return (
    <a
      href="#top"
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full  bg-[#fff] shadow-xsm  hover:bg-transparent"
    >
      {label === "Facebook" ? (
        <svg
          aria-label={label}
          width="10"
          height="15"
          viewBox="0 0 10 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.75 6V9H3V14.25H6V9H8.25L9 6H6V4.5C6 4.30109 6.07902 4.11032 6.21967 3.96967C6.36032 3.82902 6.55109 3.75 6.75 3.75H9V0.75H6.75C5.75544 0.75 4.80161 1.14509 4.09835 1.84835C3.39509 2.55161 3 3.50544 3 4.5V6H0.75Z"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#121212"
          />
        </svg>
      ) : label === "Instagram" ? (
        <svg
          aria-label={label}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.4932 5.96094C14.4932 4.7183 13.4858 3.71094 12.2432 3.71094H6.24316C5.00052 3.71094 3.99316 4.7183 3.99316 5.96094V11.9609C3.99316 13.2036 5.00052 14.2109 6.24316 14.2109H12.2432C13.4858 14.2109 14.4932 13.2036 14.4932 11.9609V5.96094ZM15.9932 11.9609C15.9932 14.032 14.3142 15.7109 12.2432 15.7109H6.24316C4.1721 15.7109 2.49316 14.032 2.49316 11.9609V5.96094C2.49316 3.88987 4.1721 2.21094 6.24316 2.21094H12.2432C14.3142 2.21094 15.9932 3.88987 15.9932 5.96094V11.9609ZM10.7432 8.96094C10.7432 8.13251 10.0716 7.46094 9.24317 7.46094C8.41474 7.46094 7.74317 8.13251 7.74317 8.96094C7.74317 9.78936 8.41474 10.4609 9.24317 10.4609C10.0716 10.4609 10.7432 9.78936 10.7432 8.96094ZM12.2432 8.96094C12.2432 10.6178 10.9 11.9609 9.24317 11.9609C7.58631 11.9609 6.24317 10.6178 6.24317 8.96094C6.24317 7.30408 7.58631 5.96094 9.24317 5.96094C10.9 5.96094 12.2432 7.30408 12.2432 8.96094ZM12.6182 4.83594C12.204 4.83594 11.8682 5.1727 11.8682 5.58691C11.8683 6.00102 12.204 6.33691 12.6182 6.33691C13.0323 6.33691 13.368 6.00102 13.3682 5.58691C13.3682 5.1727 13.0324 4.83594 12.6182 4.83594Z"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="#121212"
          />
        </svg>
      ) : label === "Twitter" ? (
        <svg
          aria-label={label}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.2271 2.92963C15.4771 3.29713 14.7421 3.44638 13.9771 3.67213C13.1363 2.72338 11.8898 2.67088 10.6921 3.11938C9.4943 3.56788 8.7098 4.66438 8.72705 5.92213V6.67213C6.2933 6.73438 4.1258 5.62588 2.72705 3.67213C2.72705 3.67213 -0.40945 9.24688 5.72705 11.9221C4.32305 12.8574 2.9228 13.4881 1.22705 13.4221C3.70805 14.7744 6.4118 15.2394 8.75255 14.5599C11.4376 13.7799 13.6441 11.7676 14.4908 8.75338C14.7434 7.83663 14.8688 6.88952 14.8636 5.93863C14.8621 5.75188 15.9961 3.85963 16.2271 2.92888V2.92963Z"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#121212"
          />
        </svg>
      ) : label === "email" ? (
        <svg
          aria-label={label}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.2042 6.57324L9.6202 10.2959C9.36827 10.4638 9.04009 10.4638 8.78817 10.2959L3.20418 6.57324V12.6719C3.20418 13.0861 3.53997 13.4219 3.95418 13.4219H14.4542C14.8684 13.4219 15.2042 13.0861 15.2042 12.6719V6.57324ZM3.28824 4.82655L9.20418 8.77051L15.1201 4.82655C14.9952 4.58611 14.7439 4.42188 14.4542 4.42188H3.95418C3.6645 4.42188 3.41317 4.58611 3.28824 4.82655ZM16.7041 5.1586C16.697 3.92207 15.6924 2.92188 14.4542 2.92188H3.95418C2.71596 2.92188 1.71135 3.92208 1.70422 5.15863M16.7042 5.18124V12.6719C16.7042 13.9145 15.6968 14.9219 14.4542 14.9219H3.95418C2.71154 14.9219 1.70418 13.9145 1.70418 12.6719V5.18122M16.7042 5.17188V5.18124Z"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="#121212"
          />
        </svg>
      ) : null}
    </a>
  );
}
