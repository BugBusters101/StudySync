from flask import render_template, flash, url_for, request
from sqlalchemy.exc import  NoResultFound
from werkzeug.utils import redirect

from StudySync.backend.app import app
import sqlalchemy as sqla
from StudySync.backend.app.models import user_model
from StudySync.backend.app import db
from StudySync.backend.app.controller.profile_controller import LoginForm, PreferenceForm

from flask_login import login_user, logout_user, login_required, current_user

from urllib.parse import urlsplit


@app.route('/')
def home():
    return render_template('home.html', title='Home')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        try:
            user = db.session.scalars(
                sqla.select(user_model).where(
                    user_model.firstname == form.firstname.data,
                    user_model.lastname == form.lastname.data
                )
            ).one()
            if user.check_password(form.password.data):
                login_user(user)
                next_page = request.args.get('next')
                if not next_page or urlsplit(next_page).netloc != '':
                    return redirect(url_for('home'))
                return redirect(next_page)
            else:
                flash("Wrong Password", 'danger')
        except NoResultFound:
            flash("Wrong Firstname or Lastname", 'danger')
    return render_template('login.html', title="Login", form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/profile/<int:user_id>')
@login_required
def profile(user_id):
    try:
        user = db.session.get(user_model.User, user_id)
        if user is None:
            flash("User not found", 'danger')
            return redirect(url_for('home'))
        return render_template('profile.html', title='Profile', user=user)
    except Exception as e:
        flash(f"An error occurred: {e}", 'danger')
        return redirect(url_for('home'))



@app.route('/preferences', methods=['GET', 'POST'])
@login_required
def preferences():
    form = PreferenceForm()
    if form.validate_on_submit():
        # Handle form submission logic here
        flash('Preferences saved successfully', 'success')
        return redirect(url_for('profile', user_id=current_user.id))
    return render_template('preferences.html', title='Preferences', form=form)