// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_profile_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UpdateProfileBodySelectedModeEnum
    _$updateProfileBodySelectedModeEnum_beginner =
    const UpdateProfileBodySelectedModeEnum._('beginner');
const UpdateProfileBodySelectedModeEnum
    _$updateProfileBodySelectedModeEnum_pro =
    const UpdateProfileBodySelectedModeEnum._('pro');

UpdateProfileBodySelectedModeEnum _$updateProfileBodySelectedModeEnumValueOf(
    String name) {
  switch (name) {
    case 'beginner':
      return _$updateProfileBodySelectedModeEnum_beginner;
    case 'pro':
      return _$updateProfileBodySelectedModeEnum_pro;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UpdateProfileBodySelectedModeEnum>
    _$updateProfileBodySelectedModeEnumValues = BuiltSet<
        UpdateProfileBodySelectedModeEnum>(const <UpdateProfileBodySelectedModeEnum>[
  _$updateProfileBodySelectedModeEnum_beginner,
  _$updateProfileBodySelectedModeEnum_pro,
]);

const UpdateProfileBodyThemePreferenceEnum
    _$updateProfileBodyThemePreferenceEnum_light =
    const UpdateProfileBodyThemePreferenceEnum._('light');
const UpdateProfileBodyThemePreferenceEnum
    _$updateProfileBodyThemePreferenceEnum_dark =
    const UpdateProfileBodyThemePreferenceEnum._('dark');

UpdateProfileBodyThemePreferenceEnum
    _$updateProfileBodyThemePreferenceEnumValueOf(String name) {
  switch (name) {
    case 'light':
      return _$updateProfileBodyThemePreferenceEnum_light;
    case 'dark':
      return _$updateProfileBodyThemePreferenceEnum_dark;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UpdateProfileBodyThemePreferenceEnum>
    _$updateProfileBodyThemePreferenceEnumValues = BuiltSet<
        UpdateProfileBodyThemePreferenceEnum>(const <UpdateProfileBodyThemePreferenceEnum>[
  _$updateProfileBodyThemePreferenceEnum_light,
  _$updateProfileBodyThemePreferenceEnum_dark,
]);

const UpdateProfileBodyLangEnum _$updateProfileBodyLangEnum_en =
    const UpdateProfileBodyLangEnum._('en');
const UpdateProfileBodyLangEnum _$updateProfileBodyLangEnum_id =
    const UpdateProfileBodyLangEnum._('id');

UpdateProfileBodyLangEnum _$updateProfileBodyLangEnumValueOf(String name) {
  switch (name) {
    case 'en':
      return _$updateProfileBodyLangEnum_en;
    case 'id':
      return _$updateProfileBodyLangEnum_id;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UpdateProfileBodyLangEnum> _$updateProfileBodyLangEnumValues =
    BuiltSet<UpdateProfileBodyLangEnum>(const <UpdateProfileBodyLangEnum>[
  _$updateProfileBodyLangEnum_en,
  _$updateProfileBodyLangEnum_id,
]);

Serializer<UpdateProfileBodySelectedModeEnum>
    _$updateProfileBodySelectedModeEnumSerializer =
    _$UpdateProfileBodySelectedModeEnumSerializer();
Serializer<UpdateProfileBodyThemePreferenceEnum>
    _$updateProfileBodyThemePreferenceEnumSerializer =
    _$UpdateProfileBodyThemePreferenceEnumSerializer();
Serializer<UpdateProfileBodyLangEnum> _$updateProfileBodyLangEnumSerializer =
    _$UpdateProfileBodyLangEnumSerializer();

class _$UpdateProfileBodySelectedModeEnumSerializer
    implements PrimitiveSerializer<UpdateProfileBodySelectedModeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'beginner': 'beginner',
    'pro': 'pro',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'beginner': 'beginner',
    'pro': 'pro',
  };

  @override
  final Iterable<Type> types = const <Type>[UpdateProfileBodySelectedModeEnum];
  @override
  final String wireName = 'UpdateProfileBodySelectedModeEnum';

  @override
  Object serialize(
          Serializers serializers, UpdateProfileBodySelectedModeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateProfileBodySelectedModeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateProfileBodySelectedModeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateProfileBodyThemePreferenceEnumSerializer
    implements PrimitiveSerializer<UpdateProfileBodyThemePreferenceEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'light': 'light',
    'dark': 'dark',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'light': 'light',
    'dark': 'dark',
  };

  @override
  final Iterable<Type> types = const <Type>[
    UpdateProfileBodyThemePreferenceEnum
  ];
  @override
  final String wireName = 'UpdateProfileBodyThemePreferenceEnum';

  @override
  Object serialize(
          Serializers serializers, UpdateProfileBodyThemePreferenceEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateProfileBodyThemePreferenceEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateProfileBodyThemePreferenceEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateProfileBodyLangEnumSerializer
    implements PrimitiveSerializer<UpdateProfileBodyLangEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'en': 'en',
    'id': 'id',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'en': 'en',
    'id': 'id',
  };

  @override
  final Iterable<Type> types = const <Type>[UpdateProfileBodyLangEnum];
  @override
  final String wireName = 'UpdateProfileBodyLangEnum';

  @override
  Object serialize(Serializers serializers, UpdateProfileBodyLangEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateProfileBodyLangEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateProfileBodyLangEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateProfileBody extends UpdateProfileBody {
  @override
  final String? displayName;
  @override
  final UpdateProfileBodySelectedModeEnum? selectedMode;
  @override
  final UpdateProfileBodyThemePreferenceEnum? themePreference;
  @override
  final bool? onboardingCompleted;
  @override
  final UpdateProfileBodyLangEnum? lang;
  @override
  final String? avatarUrl;

  factory _$UpdateProfileBody(
          [void Function(UpdateProfileBodyBuilder)? updates]) =>
      (UpdateProfileBodyBuilder()..update(updates))._build();

  _$UpdateProfileBody._(
      {this.displayName,
      this.selectedMode,
      this.themePreference,
      this.onboardingCompleted,
      this.lang,
      this.avatarUrl})
      : super._();
  @override
  UpdateProfileBody rebuild(void Function(UpdateProfileBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateProfileBodyBuilder toBuilder() =>
      UpdateProfileBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateProfileBody &&
        displayName == other.displayName &&
        selectedMode == other.selectedMode &&
        themePreference == other.themePreference &&
        onboardingCompleted == other.onboardingCompleted &&
        lang == other.lang &&
        avatarUrl == other.avatarUrl;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, displayName.hashCode);
    _$hash = $jc(_$hash, selectedMode.hashCode);
    _$hash = $jc(_$hash, themePreference.hashCode);
    _$hash = $jc(_$hash, onboardingCompleted.hashCode);
    _$hash = $jc(_$hash, lang.hashCode);
    _$hash = $jc(_$hash, avatarUrl.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateProfileBody')
          ..add('displayName', displayName)
          ..add('selectedMode', selectedMode)
          ..add('themePreference', themePreference)
          ..add('onboardingCompleted', onboardingCompleted)
          ..add('lang', lang)
          ..add('avatarUrl', avatarUrl))
        .toString();
  }
}

class UpdateProfileBodyBuilder
    implements Builder<UpdateProfileBody, UpdateProfileBodyBuilder> {
  _$UpdateProfileBody? _$v;

  String? _displayName;
  String? get displayName => _$this._displayName;
  set displayName(String? displayName) => _$this._displayName = displayName;

  UpdateProfileBodySelectedModeEnum? _selectedMode;
  UpdateProfileBodySelectedModeEnum? get selectedMode => _$this._selectedMode;
  set selectedMode(UpdateProfileBodySelectedModeEnum? selectedMode) =>
      _$this._selectedMode = selectedMode;

  UpdateProfileBodyThemePreferenceEnum? _themePreference;
  UpdateProfileBodyThemePreferenceEnum? get themePreference =>
      _$this._themePreference;
  set themePreference(UpdateProfileBodyThemePreferenceEnum? themePreference) =>
      _$this._themePreference = themePreference;

  bool? _onboardingCompleted;
  bool? get onboardingCompleted => _$this._onboardingCompleted;
  set onboardingCompleted(bool? onboardingCompleted) =>
      _$this._onboardingCompleted = onboardingCompleted;

  UpdateProfileBodyLangEnum? _lang;
  UpdateProfileBodyLangEnum? get lang => _$this._lang;
  set lang(UpdateProfileBodyLangEnum? lang) => _$this._lang = lang;

  String? _avatarUrl;
  String? get avatarUrl => _$this._avatarUrl;
  set avatarUrl(String? avatarUrl) => _$this._avatarUrl = avatarUrl;

  UpdateProfileBodyBuilder() {
    UpdateProfileBody._defaults(this);
  }

  UpdateProfileBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _displayName = $v.displayName;
      _selectedMode = $v.selectedMode;
      _themePreference = $v.themePreference;
      _onboardingCompleted = $v.onboardingCompleted;
      _lang = $v.lang;
      _avatarUrl = $v.avatarUrl;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateProfileBody other) {
    _$v = other as _$UpdateProfileBody;
  }

  @override
  void update(void Function(UpdateProfileBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateProfileBody build() => _build();

  _$UpdateProfileBody _build() {
    final _$result = _$v ??
        _$UpdateProfileBody._(
          displayName: displayName,
          selectedMode: selectedMode,
          themePreference: themePreference,
          onboardingCompleted: onboardingCompleted,
          lang: lang,
          avatarUrl: avatarUrl,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
