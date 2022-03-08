async function renderStats() {
  const user = await getUser();
  // user.page = "";
  // console.log(user);
  Jimp.read("profile.png").then((profile) => {
    Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then((font) => {
      profile.print(font, 100, 50, user.country_code);

      Jimp.read(user.avatar_url).then((avatar) => {
        profile.blit(avatar, 100, 200);
        await profile.write("profile1.png");
      });
    });
  });
}
