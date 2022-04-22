/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

// Show user's contacts only when they're loaded
exports.index = async (req, res) => {
  try {
    const contacts = await res.locals.contact;
    const render = await res.render('index', { contacts });
    return render;
  } catch (e) {
    console.log(e);
  }
};
