// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_evidence_session.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionEvidenceSession extends ProgressionEvidenceSession {
  @override
  final String token;
  @override
  final String source_;
  @override
  final String subject;
  @override
  final DateTime minimumCompleteAt;

  factory _$ProgressionEvidenceSession(
          [void Function(ProgressionEvidenceSessionBuilder)? updates]) =>
      (ProgressionEvidenceSessionBuilder()..update(updates))._build();

  _$ProgressionEvidenceSession._(
      {required this.token,
      required this.source_,
      required this.subject,
      required this.minimumCompleteAt})
      : super._();
  @override
  ProgressionEvidenceSession rebuild(
          void Function(ProgressionEvidenceSessionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionEvidenceSessionBuilder toBuilder() =>
      ProgressionEvidenceSessionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionEvidenceSession &&
        token == other.token &&
        source_ == other.source_ &&
        subject == other.subject &&
        minimumCompleteAt == other.minimumCompleteAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, token.hashCode);
    _$hash = $jc(_$hash, source_.hashCode);
    _$hash = $jc(_$hash, subject.hashCode);
    _$hash = $jc(_$hash, minimumCompleteAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionEvidenceSession')
          ..add('token', token)
          ..add('source_', source_)
          ..add('subject', subject)
          ..add('minimumCompleteAt', minimumCompleteAt))
        .toString();
  }
}

class ProgressionEvidenceSessionBuilder
    implements
        Builder<ProgressionEvidenceSession, ProgressionEvidenceSessionBuilder> {
  _$ProgressionEvidenceSession? _$v;

  String? _token;
  String? get token => _$this._token;
  set token(String? token) => _$this._token = token;

  String? _source_;
  String? get source_ => _$this._source_;
  set source_(String? source_) => _$this._source_ = source_;

  String? _subject;
  String? get subject => _$this._subject;
  set subject(String? subject) => _$this._subject = subject;

  DateTime? _minimumCompleteAt;
  DateTime? get minimumCompleteAt => _$this._minimumCompleteAt;
  set minimumCompleteAt(DateTime? minimumCompleteAt) =>
      _$this._minimumCompleteAt = minimumCompleteAt;

  ProgressionEvidenceSessionBuilder() {
    ProgressionEvidenceSession._defaults(this);
  }

  ProgressionEvidenceSessionBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _token = $v.token;
      _source_ = $v.source_;
      _subject = $v.subject;
      _minimumCompleteAt = $v.minimumCompleteAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionEvidenceSession other) {
    _$v = other as _$ProgressionEvidenceSession;
  }

  @override
  void update(void Function(ProgressionEvidenceSessionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionEvidenceSession build() => _build();

  _$ProgressionEvidenceSession _build() {
    final _$result = _$v ??
        _$ProgressionEvidenceSession._(
          token: BuiltValueNullFieldError.checkNotNull(
              token, r'ProgressionEvidenceSession', 'token'),
          source_: BuiltValueNullFieldError.checkNotNull(
              source_, r'ProgressionEvidenceSession', 'source_'),
          subject: BuiltValueNullFieldError.checkNotNull(
              subject, r'ProgressionEvidenceSession', 'subject'),
          minimumCompleteAt: BuiltValueNullFieldError.checkNotNull(
              minimumCompleteAt,
              r'ProgressionEvidenceSession',
              'minimumCompleteAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
