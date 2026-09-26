// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'doku_checkout_session.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DokuCheckoutSession extends DokuCheckoutSession {
  @override
  final int id;
  @override
  final String paymentUrl;
  @override
  final DateTime expiresAt;

  factory _$DokuCheckoutSession(
          [void Function(DokuCheckoutSessionBuilder)? updates]) =>
      (DokuCheckoutSessionBuilder()..update(updates))._build();

  _$DokuCheckoutSession._(
      {required this.id, required this.paymentUrl, required this.expiresAt})
      : super._();
  @override
  DokuCheckoutSession rebuild(
          void Function(DokuCheckoutSessionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DokuCheckoutSessionBuilder toBuilder() =>
      DokuCheckoutSessionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DokuCheckoutSession &&
        id == other.id &&
        paymentUrl == other.paymentUrl &&
        expiresAt == other.expiresAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, paymentUrl.hashCode);
    _$hash = $jc(_$hash, expiresAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DokuCheckoutSession')
          ..add('id', id)
          ..add('paymentUrl', paymentUrl)
          ..add('expiresAt', expiresAt))
        .toString();
  }
}

class DokuCheckoutSessionBuilder
    implements Builder<DokuCheckoutSession, DokuCheckoutSessionBuilder> {
  _$DokuCheckoutSession? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  String? _paymentUrl;
  String? get paymentUrl => _$this._paymentUrl;
  set paymentUrl(String? paymentUrl) => _$this._paymentUrl = paymentUrl;

  DateTime? _expiresAt;
  DateTime? get expiresAt => _$this._expiresAt;
  set expiresAt(DateTime? expiresAt) => _$this._expiresAt = expiresAt;

  DokuCheckoutSessionBuilder() {
    DokuCheckoutSession._defaults(this);
  }

  DokuCheckoutSessionBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _paymentUrl = $v.paymentUrl;
      _expiresAt = $v.expiresAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DokuCheckoutSession other) {
    _$v = other as _$DokuCheckoutSession;
  }

  @override
  void update(void Function(DokuCheckoutSessionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DokuCheckoutSession build() => _build();

  _$DokuCheckoutSession _build() {
    final _$result = _$v ??
        _$DokuCheckoutSession._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'DokuCheckoutSession', 'id'),
          paymentUrl: BuiltValueNullFieldError.checkNotNull(
              paymentUrl, r'DokuCheckoutSession', 'paymentUrl'),
          expiresAt: BuiltValueNullFieldError.checkNotNull(
              expiresAt, r'DokuCheckoutSession', 'expiresAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
