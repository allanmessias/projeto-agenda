// Show index page only if there's no user logged, if so, it'll show '404'
exports.index = async (req, res) => {
  if (!res.locals.idUser) {
    res.render('index');
    return;
  }
  const userEmailSlice = String(req.user.email).split('@')[0];
  res.redirect(`/user/${userEmailSlice}`);
};
