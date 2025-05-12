export const protectInfo = () => {
  const user1 = "biuro";
  const user2 = "k.brzozowski";
  const user3 = "b.brzozowski";
  const domain = "kbb-instal";
  const tld = "pl";
  const phoneNumb1 = "+48 502 522 398";
  const phoneNumb2 = "+48 502 522 397";
  // Złożenie adresu

  const emailAddress1 = user1 + "@" + domain + "." + tld;
  const emailAddress2 = user2 + "@" + domain + "." + tld;
  const emailAddress3 = user3 + "@" + domain + "." + tld;
  // Wyświetlenie jako klikalny link

  const emails1 = document.querySelectorAll(".email-1");
  const emails2 = document.querySelectorAll(".email-2");
  const emails3 = document.querySelectorAll(".email-3");

  const phone1 = document.querySelectorAll(".phone-1");
  const phone2 = document.querySelectorAll(".phone-2");

  Array.from(emails1).forEach(
    email =>
      (email.innerHTML =
        '<a href="mailto:' +
        emailAddress1 +
        '" class="hover-underline">' +
        emailAddress1 +
        "</a>")
  );
  Array.from(emails2).forEach(
    email =>
      (email.innerHTML =
        '<a href="mailto:' +
        emailAddress2 +
        '" class="hover-underline">' +
        emailAddress2 +
        "</a>")
  );
  Array.from(emails3).forEach(
    email =>
      (email.innerHTML =
        '<a href="mailto:' +
        emailAddress3 +
        '" class="hover-underline">' +
        emailAddress3 +
        "</a>")
  );
  Array.from(phone1).forEach(
    email =>
      (email.innerHTML =
        '<a href="callto:' +
        phoneNumb1.replaceAll(" ", "") +
        '" class="hover-underline">' +
        phoneNumb1 +
        "</a>")
  );
  Array.from(phone2).forEach(
    email =>
      (email.innerHTML =
        '<a href="callto:' +
        phoneNumb2.replaceAll(" ", "") +
        '" class="hover-underline">' +
        phoneNumb2 +
        " (Hurtownia)" +
        "</a>")
  );
};

export const copyrightDate = (): void => {
  const startYear = 2020;
  const presentYear = new Date().getFullYear();
  const copyrightDate = document.getElementById("copyright-date");

  if (!copyrightDate) {
    return;
  }

  if (startYear === presentYear) {
    copyrightDate.innerText = startYear + "";
  } else {
    copyrightDate.innerText = `${startYear} - ${presentYear}`;
  }
};
