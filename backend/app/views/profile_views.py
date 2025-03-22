# from flask import render_template, flash, url_for, request, app
# from werkzeug.utils import redirect
# from backend.app.models import user_model
# from backend.app.controller.profile_controller import LoginForm, PreferenceForm
# from flask_login import login_user, logout_user, login_required, current_user
# from urllib.parse import urlsplit
# from flask import request, jsonify
# from werkzeug.security import generate_password_hash
# from backend.app.utils.database import get_db_connection
#
# @app.route('/')
# def home():
#     return render_template('home.html', title='Home')
# #
# # @app.route('/login', methods=['GET', 'POST'])
# # def login():
# #     form = LoginForm()
# #     if form.validate_on_submit():
# #         conn = get_db_connection()
# #         try:
# #             user = conn.execute(
# #                 'SELECT * FROM user WHERE firstname = ? AND lastname = ?',
# #                 (form.firstname.data, form.lastname.data)
# #             ).fetchone()
# #             if user and user_model.User.check_password(user['password'], form.password.data):
# #                 login_user(user_model.User(**user))
# #                 next_page = request.args.get('next')
# #                 if not next_page or urlsplit(next_page).netloc != '':
# #                     return redirect(url_for('home'))
# #                 return redirect(next_page)
# #             else:
# #                 flash("Wrong Password", 'danger')
# #         except Exception as e:
# #             flash(f"An error occurred: {e}", 'danger')
# #         finally:
# #             conn.close()
# #     return render_template('login.html', title="Login", form=form)
# #
# # @app.route('/logout')
# # def logout():
# #     logout_user()
# #     return redirect(url_for('home'))
# #
# # @app.route('/profile/<int:user_id>')
# # @login_required
# # def profile(user_id):
# #     conn = get_db_connection()
# #     try:
# #         user = conn.execute(
# #             'SELECT * FROM user WHERE id = ?',
# #             (user_id,)
# #         ).fetchone()
# #         if user is None:
# #             flash("User not found", 'danger')
# #             return redirect(url_for('home'))
# #         return render_template('profile.html', title='Profile', user=user)
# #     except Exception as e:
# #         flash(f"An error occurred: {e}", 'danger')
# #         return redirect(url_for('home'))
# #     finally:
# #         conn.close()
# #
# # @app.route('/preferences', methods=['GET', 'POST'])
# # @login_required
# # def preferences():
# #     form = PreferenceForm()
# #     if form.validate_on_submit():
# #         # Handle form submission logic here
# #         flash('Preferences saved successfully', 'success')
# #         return redirect(url_for('profile', user_id=current_user.id))
# #     return render_template('preferences.html', title='Preferences', form=form)
#
#
# from flask import jsonify
#
#
# @app.route('/api/login', methods=['POST'])
# def api_login():
#     data = request.get_json()
#     firstname = data.get('firstname')
#     lastname = data.get('lastname')
#     password = data.get('password')
#
#     conn = get_db_connection()
#     try:
#         user = conn.execute(
#             'SELECT * FROM user WHERE firstname = ? AND lastname = ?',
#             (firstname, lastname)
#         ).fetchone()
#         if user and user_model.User.check_password(user['password'], password):
#             login_user(user_model.User(**user))
#             return jsonify({"message": "Login successful", "user_id": user['id']}), 200
#         else:
#             return jsonify({"message": "Invalid credentials"}), 401
#     except Exception as e:
#         return jsonify({"message": f"An error occurred: {e}"}), 500
#     finally:
#         conn.close()
#
#
#
# @app.route('/api/signup', methods=['POST'])
# def api_signup():
#     data = request.get_json()
#     firstname = data.get('firstname')
#     lastname = data.get('lastname')
#     email = data.get('email')
#     password = data.get('password')
#
#     conn = get_db_connection()
#     try:
#         # Check if the user already exists
#         existing_user = conn.execute(
#             'SELECT * FROM user WHERE email = ?',
#             (email,)
#         ).fetchone()
#         if existing_user:
#             return jsonify({"message": "User already exists"}), 400
#
#         # Create a new user
#         password_hash = generate_password_hash(password)
#         conn.execute(
#             'INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
#             (firstname, lastname, email, password_hash)
#         )
#         conn.commit()
#         return jsonify({"message": "User created successfully"}), 201
#     except Exception as e:
#         return jsonify({"message": f"An error occurred: {e}"}), 500
#     finally:
#         conn.close()