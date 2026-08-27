// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'broadcast_send_result.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$BroadcastSendResult extends BroadcastSendResult {
  @override
  final int broadcastId;
  @override
  final int recipientCount;
  @override
  final String message;

  factory _$BroadcastSendResult(
          [void Function(BroadcastSendResultBuilder)? updates]) =>
      (BroadcastSendResultBuilder()..update(updates))._build();

  _$BroadcastSendResult._(
      {required this.broadcastId,
      required this.recipientCount,
      required this.message})
      : super._();
  @override
  BroadcastSendResult rebuild(
          void Function(BroadcastSendResultBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  BroadcastSendResultBuilder toBuilder() =>
      BroadcastSendResultBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is BroadcastSendResult &&
        broadcastId == other.broadcastId &&
        recipientCount == other.recipientCount &&
        message == other.message;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, broadcastId.hashCode);
    _$hash = $jc(_$hash, recipientCount.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'BroadcastSendResult')
          ..add('broadcastId', broadcastId)
          ..add('recipientCount', recipientCount)
          ..add('message', message))
        .toString();
  }
}

class BroadcastSendResultBuilder
    implements Builder<BroadcastSendResult, BroadcastSendResultBuilder> {
  _$BroadcastSendResult? _$v;

  int? _broadcastId;
  int? get broadcastId => _$this._broadcastId;
  set broadcastId(int? broadcastId) => _$this._broadcastId = broadcastId;

  int? _recipientCount;
  int? get recipientCount => _$this._recipientCount;
  set recipientCount(int? recipientCount) =>
      _$this._recipientCount = recipientCount;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  BroadcastSendResultBuilder() {
    BroadcastSendResult._defaults(this);
  }

  BroadcastSendResultBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _broadcastId = $v.broadcastId;
      _recipientCount = $v.recipientCount;
      _message = $v.message;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(BroadcastSendResult other) {
    _$v = other as _$BroadcastSendResult;
  }

  @override
  void update(void Function(BroadcastSendResultBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  BroadcastSendResult build() => _build();

  _$BroadcastSendResult _build() {
    final _$result = _$v ??
        _$BroadcastSendResult._(
          broadcastId: BuiltValueNullFieldError.checkNotNull(
              broadcastId, r'BroadcastSendResult', 'broadcastId'),
          recipientCount: BuiltValueNullFieldError.checkNotNull(
              recipientCount, r'BroadcastSendResult', 'recipientCount'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'BroadcastSendResult', 'message'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
