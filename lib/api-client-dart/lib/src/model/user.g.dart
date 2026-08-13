// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UserRoleEnum _$userRoleEnum_user = const UserRoleEnum._('user');
const UserRoleEnum _$userRoleEnum_admin = const UserRoleEnum._('admin');
const UserRoleEnum _$userRoleEnum_superAdmin =
    const UserRoleEnum._('superAdmin');

UserRoleEnum _$userRoleEnumValueOf(String name) {
  switch (name) {
    case 'user':
      return _$userRoleEnum_user;
    case 'admin':
      return _$userRoleEnum_admin;
    case 'superAdmin':
      return _$userRoleEnum_superAdmin;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserRoleEnum> _$userRoleEnumValues =
    BuiltSet<UserRoleEnum>(const <UserRoleEnum>[
  _$userRoleEnum_user,
  _$userRoleEnum_admin,
  _$userRoleEnum_superAdmin,
]);

const UserSelectedModeEnum _$userSelectedModeEnum_beginner =
    const UserSelectedModeEnum._('beginner');
const UserSelectedModeEnum _$userSelectedModeEnum_pro =
    const UserSelectedModeEnum._('pro');

UserSelectedModeEnum _$userSelectedModeEnumValueOf(String name) {
  switch (name) {
    case 'beginner':
      return _$userSelectedModeEnum_beginner;
    case 'pro':
      return _$userSelectedModeEnum_pro;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserSelectedModeEnum> _$userSelectedModeEnumValues =
    BuiltSet<UserSelectedModeEnum>(const <UserSelectedModeEnum>[
  _$userSelectedModeEnum_beginner,
  _$userSelectedModeEnum_pro,
]);

const UserThemePreferenceEnum _$userThemePreferenceEnum_light =
    const UserThemePreferenceEnum._('light');
const UserThemePreferenceEnum _$userThemePreferenceEnum_dark =
    const UserThemePreferenceEnum._('dark');

UserThemePreferenceEnum _$userThemePreferenceEnumValueOf(String name) {
  switch (name) {
    case 'light':
      return _$userThemePreferenceEnum_light;
    case 'dark':
      return _$userThemePreferenceEnum_dark;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserThemePreferenceEnum> _$userThemePreferenceEnumValues =
    BuiltSet<UserThemePreferenceEnum>(const <UserThemePreferenceEnum>[
  _$userThemePreferenceEnum_light,
  _$userThemePreferenceEnum_dark,
]);

Serializer<UserRoleEnum> _$userRoleEnumSerializer = _$UserRoleEnumSerializer();
Serializer<UserSelectedModeEnum> _$userSelectedModeEnumSerializer =
    _$UserSelectedModeEnumSerializer();
Serializer<UserThemePreferenceEnum> _$userThemePreferenceEnumSerializer =
    _$UserThemePreferenceEnumSerializer();

class _$UserRoleEnumSerializer implements PrimitiveSerializer<UserRoleEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'user': 'user',
    'admin': 'admin',
    'superAdmin': 'super_admin',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'user': 'user',
    'admin': 'admin',
    'super_admin': 'superAdmin',
  };

  @override
  final Iterable<Type> types = const <Type>[UserRoleEnum];
  @override
  final String wireName = 'UserRoleEnum';

  @override
  Object serialize(Serializers serializers, UserRoleEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserRoleEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserRoleEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserSelectedModeEnumSerializer
    implements PrimitiveSerializer<UserSelectedModeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'beginner': 'beginner',
    'pro': 'pro',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'beginner': 'beginner',
    'pro': 'pro',
  };

  @override
  final Iterable<Type> types = const <Type>[UserSelectedModeEnum];
  @override
  final String wireName = 'UserSelectedModeEnum';

  @override
  Object serialize(Serializers serializers, UserSelectedModeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserSelectedModeEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserSelectedModeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserThemePreferenceEnumSerializer
    implements PrimitiveSerializer<UserThemePreferenceEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'light': 'light',
    'dark': 'dark',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'light': 'light',
    'dark': 'dark',
  };

  @override
  final Iterable<Type> types = const <Type>[UserThemePreferenceEnum];
  @override
  final String wireName = 'UserThemePreferenceEnum';

  @override
  Object serialize(Serializers serializers, UserThemePreferenceEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserThemePreferenceEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserThemePreferenceEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$User extends User {
  @override
  final int id;
  @override
  final String email;
  @override
  final String displayName;
  @override
  final String? avatarUrl;
  @override
  final UserRoleEnum role;
  @override
  final UserSelectedModeEnum selectedMode;
  @override
  final UserThemePreferenceEnum themePreference;
  @override
  final String? securityQuestion;
  @override
  final bool onboardingCompleted;
  @override
  final DateTime createdAt;

  factory _$User([void Function(UserBuilder)? updates]) =>
      (UserBuilder()..update(updates))._build();

  _$User._(
      {required this.id,
      required this.email,
      required this.displayName,
      this.avatarUrl,
      required this.role,
      required this.selectedMode,
      required this.themePreference,
      this.securityQuestion,
      required this.onboardingCompleted,
      required this.createdAt})
      : super._();
  @override
  User rebuild(void Function(UserBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserBuilder toBuilder() => UserBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is User &&
        id == other.id &&
        email == other.email &&
        displayName == other.displayName &&
        avatarUrl == other.avatarUrl &&
        role == other.role &&
        selectedMode == other.selectedMode &&
        themePreference == other.themePreference &&
        securityQuestion == other.securityQuestion &&
        onboardingCompleted == other.onboardingCompleted &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, displayName.hashCode);
    _$hash = $jc(_$hash, avatarUrl.hashCode);
    _$hash = $jc(_$hash, role.hashCode);
    _$hash = $jc(_$hash, selectedMode.hashCode);
    _$hash = $jc(_$hash, themePreference.hashCode);
    _$hash = $jc(_$hash, securityQuestion.hashCode);
    _$hash = $jc(_$hash, onboardingCompleted.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'User')
          ..add('id', id)
          ..add('email', email)
          ..add('displayName', displayName)
          ..add('avatarUrl', avatarUrl)
          ..add('role', role)
          ..add('selectedMode', selectedMode)
          ..add('themePreference', themePreference)
          ..add('securityQuestion', securityQuestion)
          ..add('onboardingCompleted', onboardingCompleted)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class UserBuilder implements Builder<User, UserBuilder> {
  _$User? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _displayName;
  String? get displayName => _$this._displayName;
  set displayName(String? displayName) => _$this._displayName = displayName;

  String? _avatarUrl;
  String? get avatarUrl => _$this._avatarUrl;
  set avatarUrl(String? avatarUrl) => _$this._avatarUrl = avatarUrl;

  UserRoleEnum? _role;
  UserRoleEnum? get role => _$this._role;
  set role(UserRoleEnum? role) => _$this._role = role;

  UserSelectedModeEnum? _selectedMode;
  UserSelectedModeEnum? get selectedMode => _$this._selectedMode;
  set selectedMode(UserSelectedModeEnum? selectedMode) =>
      _$this._selectedMode = selectedMode;

  UserThemePreferenceEnum? _themePreference;
  UserThemePreferenceEnum? get themePreference => _$this._themePreference;
  set themePreference(UserThemePreferenceEnum? themePreference) =>
      _$this._themePreference = themePreference;

  String? _securityQuestion;
  String? get securityQuestion => _$this._securityQuestion;
  set securityQuestion(String? securityQuestion) =>
      _$this._securityQuestion = securityQuestion;

  bool? _onboardingCompleted;
  bool? get onboardingCompleted => _$this._onboardingCompleted;
  set onboardingCompleted(bool? onboardingCompleted) =>
      _$this._onboardingCompleted = onboardingCompleted;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  UserBuilder() {
    User._defaults(this);
  }

  UserBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _email = $v.email;
      _displayName = $v.displayName;
      _avatarUrl = $v.avatarUrl;
      _role = $v.role;
      _selectedMode = $v.selectedMode;
      _themePreference = $v.themePreference;
      _securityQuestion = $v.securityQuestion;
      _onboardingCompleted = $v.onboardingCompleted;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(User other) {
    _$v = other as _$User;
  }

  @override
  void update(void Function(UserBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  User build() => _build();

  _$User _build() {
    final _$result = _$v ??
        _$User._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'User', 'id'),
          email: BuiltValueNullFieldError.checkNotNull(email, r'User', 'email'),
          displayName: BuiltValueNullFieldError.checkNotNull(
              displayName, r'User', 'displayName'),
          avatarUrl: avatarUrl,
          role: BuiltValueNullFieldError.checkNotNull(role, r'User', 'role'),
          selectedMode: BuiltValueNullFieldError.checkNotNull(
              selectedMode, r'User', 'selectedMode'),
          themePreference: BuiltValueNullFieldError.checkNotNull(
              themePreference, r'User', 'themePreference'),
          securityQuestion: securityQuestion,
          onboardingCompleted: BuiltValueNullFieldError.checkNotNull(
              onboardingCompleted, r'User', 'onboardingCompleted'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'User', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
