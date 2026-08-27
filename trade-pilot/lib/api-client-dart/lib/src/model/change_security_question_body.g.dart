// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'change_security_question_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ChangeSecurityQuestionBody extends ChangeSecurityQuestionBody {
  @override
  final String currentPassword;
  @override
  final String securityQuestion;
  @override
  final String securityAnswer;

  factory _$ChangeSecurityQuestionBody(
          [void Function(ChangeSecurityQuestionBodyBuilder)? updates]) =>
      (ChangeSecurityQuestionBodyBuilder()..update(updates))._build();

  _$ChangeSecurityQuestionBody._(
      {required this.currentPassword,
      required this.securityQuestion,
      required this.securityAnswer})
      : super._();
  @override
  ChangeSecurityQuestionBody rebuild(
          void Function(ChangeSecurityQuestionBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ChangeSecurityQuestionBodyBuilder toBuilder() =>
      ChangeSecurityQuestionBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChangeSecurityQuestionBody &&
        currentPassword == other.currentPassword &&
        securityQuestion == other.securityQuestion &&
        securityAnswer == other.securityAnswer;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, currentPassword.hashCode);
    _$hash = $jc(_$hash, securityQuestion.hashCode);
    _$hash = $jc(_$hash, securityAnswer.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ChangeSecurityQuestionBody')
          ..add('currentPassword', currentPassword)
          ..add('securityQuestion', securityQuestion)
          ..add('securityAnswer', securityAnswer))
        .toString();
  }
}

class ChangeSecurityQuestionBodyBuilder
    implements
        Builder<ChangeSecurityQuestionBody, ChangeSecurityQuestionBodyBuilder> {
  _$ChangeSecurityQuestionBody? _$v;

  String? _currentPassword;
  String? get currentPassword => _$this._currentPassword;
  set currentPassword(String? currentPassword) =>
      _$this._currentPassword = currentPassword;

  String? _securityQuestion;
  String? get securityQuestion => _$this._securityQuestion;
  set securityQuestion(String? securityQuestion) =>
      _$this._securityQuestion = securityQuestion;

  String? _securityAnswer;
  String? get securityAnswer => _$this._securityAnswer;
  set securityAnswer(String? securityAnswer) =>
      _$this._securityAnswer = securityAnswer;

  ChangeSecurityQuestionBodyBuilder() {
    ChangeSecurityQuestionBody._defaults(this);
  }

  ChangeSecurityQuestionBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _currentPassword = $v.currentPassword;
      _securityQuestion = $v.securityQuestion;
      _securityAnswer = $v.securityAnswer;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ChangeSecurityQuestionBody other) {
    _$v = other as _$ChangeSecurityQuestionBody;
  }

  @override
  void update(void Function(ChangeSecurityQuestionBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ChangeSecurityQuestionBody build() => _build();

  _$ChangeSecurityQuestionBody _build() {
    final _$result = _$v ??
        _$ChangeSecurityQuestionBody._(
          currentPassword: BuiltValueNullFieldError.checkNotNull(
              currentPassword,
              r'ChangeSecurityQuestionBody',
              'currentPassword'),
          securityQuestion: BuiltValueNullFieldError.checkNotNull(
              securityQuestion,
              r'ChangeSecurityQuestionBody',
              'securityQuestion'),
          securityAnswer: BuiltValueNullFieldError.checkNotNull(
              securityAnswer, r'ChangeSecurityQuestionBody', 'securityAnswer'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
