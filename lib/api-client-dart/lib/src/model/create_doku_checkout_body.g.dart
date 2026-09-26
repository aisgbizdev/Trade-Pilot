// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_doku_checkout_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateDokuCheckoutBody extends CreateDokuCheckoutBody {
  @override
  final int amountRupiah;

  factory _$CreateDokuCheckoutBody(
          [void Function(CreateDokuCheckoutBodyBuilder)? updates]) =>
      (CreateDokuCheckoutBodyBuilder()..update(updates))._build();

  _$CreateDokuCheckoutBody._({required this.amountRupiah}) : super._();
  @override
  CreateDokuCheckoutBody rebuild(
          void Function(CreateDokuCheckoutBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateDokuCheckoutBodyBuilder toBuilder() =>
      CreateDokuCheckoutBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateDokuCheckoutBody &&
        amountRupiah == other.amountRupiah;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateDokuCheckoutBody')
          ..add('amountRupiah', amountRupiah))
        .toString();
  }
}

class CreateDokuCheckoutBodyBuilder
    implements Builder<CreateDokuCheckoutBody, CreateDokuCheckoutBodyBuilder> {
  _$CreateDokuCheckoutBody? _$v;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(int? amountRupiah) => _$this._amountRupiah = amountRupiah;

  CreateDokuCheckoutBodyBuilder() {
    CreateDokuCheckoutBody._defaults(this);
  }

  CreateDokuCheckoutBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateDokuCheckoutBody other) {
    _$v = other as _$CreateDokuCheckoutBody;
  }

  @override
  void update(void Function(CreateDokuCheckoutBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateDokuCheckoutBody build() => _build();

  _$CreateDokuCheckoutBody _build() {
    final _$result = _$v ??
        _$CreateDokuCheckoutBody._(
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'CreateDokuCheckoutBody', 'amountRupiah'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
