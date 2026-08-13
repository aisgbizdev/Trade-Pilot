// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'security_question_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SecurityQuestionResponse extends SecurityQuestionResponse {
  @override
  final String securityQuestion;
  @override
  final String email;

  factory _$SecurityQuestionResponse(
          [void Function(SecurityQuestionResponseBuilder)? updates]) =>
      (SecurityQuestionResponseBuilder()..update(updates))._build();

  _$SecurityQuestionResponse._(
      {required this.securityQuestion, required this.email})
      : super._();
  @override
  SecurityQuestionResponse rebuild(
          void Function(SecurityQuestionResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SecurityQuestionResponseBuilder toBuilder() =>
      SecurityQuestionResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SecurityQuestionResponse &&
        securityQuestion == other.securityQuestion &&
        email == other.email;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, securityQuestion.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SecurityQuestionResponse')
          ..add('securityQuestion', securityQuestion)
          ..add('email', email))
        .toString();
  }
}

class SecurityQuestionResponseBuilder
    implements
        Builder<SecurityQuestionResponse, SecurityQuestionResponseBuilder> {
  _$SecurityQuestionResponse? _$v;

  String? _securityQuestion;
  String? get securityQuestion => _$this._securityQuestion;
  set securityQuestion(String? securityQuestion) =>
      _$this._securityQuestion = securityQuestion;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  SecurityQuestionResponseBuilder() {
    SecurityQuestionResponse._defaults(this);
  }

  SecurityQuestionResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _securityQuestion = $v.securityQuestion;
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SecurityQuestionResponse other) {
    _$v = other as _$SecurityQuestionResponse;
  }

  @override
  void update(void Function(SecurityQuestionResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SecurityQuestionResponse build() => _build();

  _$SecurityQuestionResponse _build() {
    final _$result = _$v ??
        _$SecurityQuestionResponse._(
          securityQuestion: BuiltValueNullFieldError.checkNotNull(
              securityQuestion,
              r'SecurityQuestionResponse',
              'securityQuestion'),
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'SecurityQuestionResponse', 'email'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
